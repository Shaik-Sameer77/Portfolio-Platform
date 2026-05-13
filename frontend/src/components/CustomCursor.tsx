"use client";
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Slower, more fluid spring config
  const springConfig = { damping: 45, stiffness: 120 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('a, button, [role="button"], input, select, textarea');
      setIsHovered(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <>
      {/* Hollow Arrow Cursor (Responsive Leader) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] text-primary"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
          style={{
            transform: 'translate(-2px, -2px)',
          }}
        >
          {/* Combined Hollow Arrow (Head + Tail) */}
          <path 
            d="M3 3L10.07 19.97L11.5 13L17.5 19L19.5 17L13.5 11L19.97 10.07L3 3Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Glowing Orb (Lagging Follower) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {/* Outer Emission Glow */}
        <motion.div
          className="w-14 h-14 rounded-full blur-[12px]"
          style={{
            background: 'hsl(var(--primary) / 0.3)',
          }}
          animate={{
            scale: isHovered ? 2 : 1,
            opacity: isHovered ? 0.8 : 0.4,
          }}
        />
        {/* Thick Light Core */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"
          style={{
            boxShadow: '0 0 20px 4px hsl(var(--primary) / 0.6)',
          }}
          animate={{
            scale: isHovered ? 1.8 : 1,
          }}
        />
      </motion.div>
    </>
  );
};
