"use client";
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 250 };
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
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] text-primary"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-7px',
          translateY: '-4px',
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
      >
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_12px_rgba(139,92,246,0.5)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
        >
          <path d="M4.5 3L19 13L13 14.5L16 21L13.5 22L10.5 15.5L4.5 21V3Z" />
        </svg>
      </motion.div>
      
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[1]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {/* Glow layer */}
        <motion.div 
          className="absolute inset-0 bg-primary/30 rounded-full blur-xl"
          animate={{
            scale: isHovered ? 3 : 2.5,
          }}
          transition={{ duration: 0.3 }}
        />
        {/* Inner ball */}
        <motion.div 
          className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_hsl(var(--primary))]"
        />
      </motion.div>
    </>
  );
};
