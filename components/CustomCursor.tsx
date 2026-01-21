
import React, { useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null); // Outer wrapper for positioning
  const cursorDotRef = useRef<HTMLDivElement>(null); // Inner dot for styling/scaling
  const particlesRef = useRef<any[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !cursor) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Move the main cursor wrapper instantly
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      
      // Spawn particles - kept subtle
      particlesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 1, 
        size: Math.random() * 4 + 2,
        color: `255, 255, 255`
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if target is clickable
      // We check tag names and also traverse up to find 'a' or 'button' parents
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' ||
        target.getAttribute('role') === 'button' ||
        window.getComputedStyle(target).cursor === 'pointer';

      if (isClickable) {
        cursorDotRef.current?.classList.add('scale-[3]', 'opacity-40');
      } else {
        cursorDotRef.current?.classList.remove('scale-[3]', 'opacity-40');
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver); // Event delegation
    
    handleResize();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.filter = 'blur(0.5px)'; 
      ctx.globalCompositeOperation = 'screen'; 

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        
        p.life -= 0.03;
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.95;

        if (p.life <= 0 || p.size <= 0.2) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.5})`; 
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.filter = 'none';
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{ opacity: 1 }}
      />
      {/* Wrapper controls position */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      >
         {/* Dot controls appearance and scaling */}
         <div 
           ref={cursorDotRef}
           className="w-2.5 h-2.5 bg-slate-900 dark:bg-white rounded-full transition-transform duration-200 ease-out mix-blend-difference shadow-[0_0_2px_rgba(255,255,255,1)]"
         />
      </div>
    </>
  );
};
