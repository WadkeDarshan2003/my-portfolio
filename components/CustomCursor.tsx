
import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });

  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const nextX = event.clientX;
      const nextY = event.clientY;

      setIsEnabled(true);

      if (!isVisible) {
        setIsVisible(true);
        ringPosRef.current.x = nextX;
        ringPosRef.current.y = nextY;
      }

      mouseRef.current.x = nextX;
      mouseRef.current.y = nextY;
    };

    const handleTouchStart = () => {
      setIsEnabled(false);
      setIsVisible(false);
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.getAttribute('role') === 'button' ||
        window.getComputedStyle(target).cursor === 'pointer';

      if (hoveringRef.current !== isClickable) {
        hoveringRef.current = isClickable;
        setIsHoveringClickable(isClickable);
      }
    };

    const animate = () => {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      ringPosRef.current.x += (targetX - ringPosRef.current.x) * 0.22;
      ringPosRef.current.y += (targetY - ringPosRef.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x - 14}px, ${ringPosRef.current.y - 14}px, 0)`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mouseover', handleMouseOver);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed left-0 top-0 pointer-events-none transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 2147483647, willChange: 'transform' }}
      >
        <div
          className={`h-7 w-7 rounded-full border-2 border-slate-950 bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.45)] backdrop-invert transition-transform duration-150 ease-out dark:border-white dark:bg-black/10 ${isHoveringClickable ? 'scale-150' : 'scale-100'}`}
        />
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.45)] transition-opacity duration-200 dark:bg-white ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 2147483647, pointerEvents: 'none', willChange: 'transform' }}
      />
    </>
  );
};
