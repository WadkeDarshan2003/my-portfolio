/**
 * CDN Image Optimization Utility
 * 
 * Provides automated image optimization, responsive srcSet generation,
 * low-res blur-up placeholder URLs, and modern format delivery (WebP/AVIF).
 */

export interface ImageCDNParams {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  fit?: 'crop' | 'cover' | 'contain' | 'inside';
  blur?: number;
  skipCdn?: boolean;
}

const DEFAULT_QUALITY = 80;
const WSRV_CDN_BASE = 'https://wsrv.nl/';

/**
 * Normalizes and optimizes an image URL using the appropriate CDN strategy.
 */
export function getOptimizedImageUrl(src: string, params: ImageCDNParams = {}): string {
  if (!src || typeof src !== 'string') return '';
  const trimmedSrc = src.trim();

  // Return local assets, inline SVGs, data URLs, or blob URLs as-is
  if (
    trimmedSrc.startsWith('/') || 
    trimmedSrc.startsWith('data:') || 
    trimmedSrc.startsWith('blob:') || 
    trimmedSrc.endsWith('.svg')
  ) {
    return trimmedSrc;
  }

  // Disable CDN if explicitly asked or configured via environment variable
  const cdnEnabled = import.meta.env.VITE_IMAGE_CDN_ENABLED !== 'false' && !params.skipCdn;

  try {
    const urlObj = new URL(trimmedSrc);

    // Strategy 1: Unsplash Native CDN Optimization
    if (urlObj.hostname.includes('unsplash.com')) {
      if (params.width) urlObj.searchParams.set('w', params.width.toString());
      if (params.height) urlObj.searchParams.set('h', params.height.toString());
      urlObj.searchParams.set('q', (params.quality || DEFAULT_QUALITY).toString());
      urlObj.searchParams.set('auto', params.format === 'avif' ? 'avif' : 'format');
      urlObj.searchParams.set('fit', params.fit || 'crop');
      if (params.blur) {
        urlObj.searchParams.set('blur', params.blur.toString());
      }
      return urlObj.toString();
    }

    // Strategy 2: Clearbit Logo API
    if (urlObj.hostname.includes('clearbit.com')) {
      if (params.width) {
        urlObj.searchParams.set('size', params.width.toString());
      }
      return urlObj.toString();
    }

    // Strategy 3: SimpleIcons SVG CDN - return as-is
    if (urlObj.hostname.includes('simpleicons.org')) {
      return trimmedSrc;
    }

    // Strategy 4: Firebase Storage or External Web Images via Cloudflare-backed CDN (wsrv.nl)
    if (cdnEnabled && (trimmedSrc.startsWith('http://') || trimmedSrc.startsWith('https://'))) {
      const cdnUrl = new URL(WSRV_CDN_BASE);
      cdnUrl.searchParams.set('url', trimmedSrc);
      if (params.width) cdnUrl.searchParams.set('w', params.width.toString());
      if (params.height) cdnUrl.searchParams.set('h', params.height.toString());
      cdnUrl.searchParams.set('q', (params.quality || DEFAULT_QUALITY).toString());
      
      if (params.format && params.format !== 'auto') {
        cdnUrl.searchParams.set('output', params.format);
      } else {
        cdnUrl.searchParams.set('output', 'webp');
      }

      if (params.fit) {
        const fitMap: Record<string, string> = {
          crop: 'cover',
          cover: 'cover',
          contain: 'contain',
          inside: 'inside',
        };
        cdnUrl.searchParams.set('fit', fitMap[params.fit] || 'cover');
      }

      if (params.blur) {
        cdnUrl.searchParams.set('blur', Math.min(100, Math.max(1, params.blur * 5)).toString());
      }

      // Edge caching header hint
      cdnUrl.searchParams.set('we', '1');

      return cdnUrl.toString();
    }
  } catch {
    // If URL parsing fails, return original source
    return trimmedSrc;
  }

  return trimmedSrc;
}

/**
 * Generates an ultra-lightweight blurred low-resolution thumbnail URL (LQIP)
 * for instant progressive blur-up placeholder effects.
 */
export function getLowResPlaceholderUrl(src: string): string {
  if (!src) return '';
  return getOptimizedImageUrl(src, {
    width: 24,
    quality: 20,
    blur: 5,
    format: 'webp',
  });
}

/**
 * Generates a responsive `srcSet` attribute for standard breakpoints.
 */
export function generateSrcSet(
  src: string, 
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string | undefined {
  if (!src) return undefined;
  // SVGs and inline data URLs do not need responsive srcSets
  if (src.startsWith('data:') || src.startsWith('blob:') || src.endsWith('.svg')) {
    return undefined;
  }

  try {
    return widths
      .map(w => `${getOptimizedImageUrl(src, { width: w })} ${w}w`)
      .join(', ');
  } catch {
    return undefined;
  }
}
