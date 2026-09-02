"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export const ProjectDetailsCarousel = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [zoomLevel, setZoomLevel] = useState(1);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!images || images.length === 0) return null;

  const next = useCallback(() => {
    setZoomLevel(1);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setZoomLevel(1);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.5, 5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  // Single click to zoom in, Double click to zoom out
  const handleImageClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      // Double click detected -> reset zoom out
      setZoomLevel(1);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        // Single click -> zoom in step by step (2x -> 3.5x -> 5x -> 1x)
        setZoomLevel((z) => (z >= 5 ? 1 : z === 1 ? 2 : z + 1.5));
      }, 250);
    }
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset scroll to top when zooming or changing image
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
      // Force browser to recompute scrollable bounds immediately
      void containerRef.current.offsetHeight;
    }
  }, [zoomLevel, index]);

  return (
    <div className="group relative aspect-[16/10] w-full rounded-2xl border border-border bg-slate-950/80 shadow-2xl backdrop-blur-md select-none overflow-hidden flex flex-col">
      {/* Image Container with Scroll support when zoomed */}
      <div 
        ref={containerRef}
        className={`relative h-full w-full flex justify-center items-center ${
          zoomLevel > 1 
            ? "overflow-auto carousel-scrollbar p-4 cursor-zoom-out" 
            : "overflow-hidden cursor-zoom-in"
        }`}
      >
        <div
          className="relative flex items-center justify-center shrink-0 transition-all duration-300 m-auto"
          style={{
            width: zoomLevel > 1 ? `${zoomLevel * 100}%` : "100%",
            height: zoomLevel > 1 ? `${zoomLevel * 100}%` : "100%",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={images[index]}
              src={images[index]}
              alt={`Project screenshot ${index + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={handleImageClick}
              className={`max-h-full max-w-full ${
                fitMode === "contain" ? "object-contain" : "object-cover h-full w-full"
              }`}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Top Left: Zoom Toolbar & Indicator */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 p-1 backdrop-blur-md shadow-xl">
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 1}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
          title="Zoom Out (Double Click Image)"
        >
          <ZoomOut size={14} />
        </button>

        <span className="px-1.5 text-[11px] font-bold tracking-wider text-white min-w-[36px] text-center">
          {Math.round(zoomLevel * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoomLevel >= 5}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
          title="Zoom In (Single Click Image)"
        >
          <ZoomIn size={14} />
        </button>

        {zoomLevel > 1 && (
          <button
            type="button"
            onClick={handleResetZoom}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/20 hover:text-white transition-all border-l border-white/20 pl-1 cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw size={13} />
          </button>
        )}
      </div>

      {/* Top Right: Fit/Fill Toggle */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFitMode(f => f === "contain" ? "cover" : "contain")}
          className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
          title={fitMode === "contain" ? "Switch to Fill Area" : "Switch to Fit Whole Image"}
        >
          <Eye size={13} />
          <span>{fitMode === "contain" ? "Fit" : "Fill"}</span>
        </button>
      </div>

      {/* Left / Right Carousel Controls */}
      {images.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-3 flex items-center z-10 pointer-events-none">
            <button
              type="button"
              onClick={prev}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110 active:scale-90 shadow-lg cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-3 flex items-center z-10 pointer-events-none">
            <button
              type="button"
              onClick={next}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110 active:scale-90 shadow-lg cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Bottom Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 z-10 rounded-full border border-white/10 bg-black/50 px-3 py-1 backdrop-blur-md">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setZoomLevel(1); setIndex(i); }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === index ? "w-6 bg-primary" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
