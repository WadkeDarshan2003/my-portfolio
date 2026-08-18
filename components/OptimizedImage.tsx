import React, { useState, forwardRef } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({ 
  className = '', 
  wrapperClassName = '',
  alt = '', 
  src, 
  onLoad,
  ...props 
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <div className={`relative overflow-hidden w-full h-full ${wrapperClassName}`}>
      {/* Background Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200/50 dark:bg-neutral-800/50 animate-pulse" />
      )}
      
      {/* Actual Image */}
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={`transition-opacity duration-700 w-full h-full ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';
