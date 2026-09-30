import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Optimizes an image file in-browser before uploading to Firebase Storage.
 * Resizes max dimension to 1920px (preserving original aspect ratio) and converts to WebP.
 */
export async function optimizeImageBeforeUpload(
  file: File,
  maxWidthOrHeight = 1920,
  quality = 0.85
): Promise<File> {
  // If not an image or is SVG/GIF, bypass canvas optimization
  if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Preserve aspect ratio while ensuring max dimension doesn't exceed 1920px
      if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
        if (width > height) {
          height = Math.round((height * maxWidthOrHeight) / width);
          width = maxWidthOrHeight;
        } else {
          width = Math.round((width * maxWidthOrHeight) / height);
          height = maxWidthOrHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(file); // Fallback to original if canvas 2D context fails
      }

      // High quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file);
          }

          // Generate new filename with .webp extension
          const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
          const optimizedFile = new File([blob], cleanName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          console.log(
            `⚡ Image optimized before upload: ${(file.size / 1024).toFixed(1)}KB -> ${(
              optimizedFile.size / 1024
            ).toFixed(1)}KB (${width}x${height}px)`
          );

          resolve(optimizedFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // Fallback to original on error
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a file to Firebase Storage and returns the download URL
 * Automatically optimizes images in-browser to WebP before upload
 * @param file The file to upload
 * @param path The path in storage (e.g. 'projects/image.jpg')
 * @returns Promise with the download URL
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  const fileToUpload = await optimizeImageBeforeUpload(file);
  const targetPath = fileToUpload.type === 'image/webp' ? path.replace(/\.[^/.]+$/, '') + '.webp' : path;

  const storageRef = ref(storage, targetPath);
  const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress.toFixed(0) + '% done');
      },
      (error) => {
        console.error('❌ File upload failed. Ensure the file is valid and you have a stable connection.');
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
