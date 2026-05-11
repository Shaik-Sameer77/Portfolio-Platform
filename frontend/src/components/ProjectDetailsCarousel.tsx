"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ProjectDetailsCarousel = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`Project screenshot ${index + 1}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-4 flex items-center">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center">
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-primary" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
