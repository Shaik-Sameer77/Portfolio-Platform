"use client";
import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export const InteractiveGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement
  const springConfig = { damping: 20, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalized coordinates (-0.5 to 0.5)
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Gradient follow effect
  const background = useTransform(
    [smoothX, smoothY],
    ([x, y]: any[]) => `radial-gradient(circle at ${50 + x * 50}% ${50 + y * 50}%, rgba(var(--primary), 0.15) 0%, transparent 50%)`
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" ref={containerRef}>
      {/* Dynamic Background Gradient */}
      <motion.div 
        className="absolute inset-0 opacity-40" 
        style={{ background }} 
      />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 grid-fade opacity-[0.03]" />
      
      {/* Floating Blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
        style={{
          x: useTransform(smoothX, (val) => val * 100),
          y: useTransform(smoothY, (val) => val * 100),
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[96px]"
        style={{
          x: useTransform(smoothX, (val) => val * -150),
          y: useTransform(smoothY, (val) => val * -150),
        }}
      />
    </div>
  );
};
