import React, { useState, forwardRef, useMemo } from 'react';
import { getOptimizedImageUrl, getLowResPlaceholderUrl, generateSrcSet } from '../utils/cdn';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  priority?: boolean;
  blurUp?: boolean;
  autoSrcSet?: boolean;
  fallbackSrc?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({ 
  className = '', 
  wrapperClassName = '',
  alt = '', 
  src, 
  srcSet,
  sizes,
  onLoad,
  onError,
  priority = false,
  blurUp = true,
  autoSrcSet = true,
  fallbackSrc,
  loading,
  decoding = 'async',
  fetchPriority,
  ...props 
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryWithoutCdn, setRetryWithoutCdn] = useState(false);

  // Compute final optimized src & placeholders
  const rawSrc = src || '';

  const finalSrc = useMemo(() => {
    if (!rawSrc) return '';
    if (retryWithoutCdn) return rawSrc; // Direct URL fallback if CDN failed
    return getOptimizedImageUrl(rawSrc);
  }, [rawSrc, retryWithoutCdn]);

  const placeholderUrl = useMemo(() => {
    if (!rawSrc || !blurUp || retryWithoutCdn) return '';
    return getLowResPlaceholderUrl(rawSrc);
  }, [rawSrc, blurUp, retryWithoutCdn]);

  const computedSrcSet = useMemo(() => {
    if (srcSet) return srcSet;
    if (!autoSrcSet || !rawSrc || retryWithoutCdn) return undefined;
    return generateSrcSet(rawSrc);
  }, [srcSet, autoSrcSet, rawSrc, retryWithoutCdn]);

  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!retryWithoutCdn && rawSrc && rawSrc.startsWith('http')) {
      // First retry directly with original raw source (bypassing CDN proxy)
      setRetryWithoutCdn(true);
    } else {
      setHasError(true);
      if (onError) {
        onError(e);
      }
    }
  };

  const effectiveLoading = loading || (priority ? 'eager' : 'lazy');
  const effectiveFetchPriority = fetchPriority || (priority ? 'high' : 'auto');

  return (
    <div className={`relative overflow-hidden w-full h-full ${wrapperClassName}`}>
      {/* 1. Low-Res Blur-Up Placeholder */}
      {blurUp && placeholderUrl && !isLoaded && !hasError && (
        <img
          src={placeholderUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 opacity-70 pointer-events-none transition-opacity duration-500 z-0"
        />
      )}

      {/* 2. Skeleton Pulse Indicator (when blur-up not available or while initializing) */}
      {!isLoaded && !hasError && (!blurUp || !placeholderUrl) && (
        <div className="absolute inset-0 bg-slate-200/60 dark:bg-neutral-800/60 animate-pulse z-0" />
      )}

      {/* 3. Error Fallback UI */}
      {hasError ? (
        fallbackSrc ? (
          <img
            src={fallbackSrc}
            alt={alt}
            className={`w-full h-full object-cover ${className}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600 p-4 text-center">
            <svg className="w-8 h-8 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-mono opacity-60">Image Unavailable</span>
          </div>
        )
      ) : (
        /* 4. Main High-Res Image */
        <img
          ref={ref}
          src={finalSrc}
          srcSet={computedSrcSet}
          sizes={defaultSizes}
          alt={alt}
          loading={effectiveLoading}
          decoding={decoding}
          fetchPriority={effectiveFetchPriority}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-700 ease-out w-full h-full z-10 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';
