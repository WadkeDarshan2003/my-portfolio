
import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });

  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const nextX = event.clientX;
      const nextY = event.clientY;

      if (!isVisible) {
        setIsVisible(true);
        ringPosRef.current.x = nextX;
        ringPosRef.current.y = nextY;
      }

      mouseRef.current.x = nextX;
      mouseRef.current.y = nextY;
    };

    const handleTouchStart = () => {
      setIsTouch(true);
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

      setIsHoveringClickable(isClickable);
    };

    const animate = () => {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      ringPosRef.current.x += (targetX - ringPosRef.current.x) * 0.22;
      ringPosRef.current.y += (targetY - ringPosRef.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0)`;
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
  }, [isVisible]);

  if (isTouch) {
    return null;
  }

  return (
    <>
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 z-[100010] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div
          className={`w-7 h-7 rounded-full border-2 border-black dark:border-white bg-transparent transition-transform duration-150 ease-out ${isHoveringClickable ? 'scale-150' : 'scale-100'}`}
        />
      </div>
    </>
  );
};
