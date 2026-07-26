// DetailPhotoModal.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Frame,
  SlidersHorizontal,
} from "lucide-react";

// Types
export interface PolaroidPhoto {
  id: string | number;
  url: string;
  caption: string;
  date?: string;
}

export type FrameStyle = "classic" | "scallop" | "floral" | "hearts" | "washi";

interface DetailPhotoModalProps {
  selectedPhoto: PolaroidPhoto;
  photos: PolaroidPhoto[];
  selectedIndex: number;
  onClose: () => void;
  onPrev: (e?: React.MouseEvent) => void;
  onNext: (e?: React.MouseEvent) => void;
}

export function DetailPhotoModal({
  selectedPhoto,
  photos,
  selectedIndex,
  onClose,
  onPrev,
  onNext,
}: DetailPhotoModalProps) {
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("classic");
  const [framePadding, setFramePadding] = useState<number>(12);

  const getFrameStyles = (): React.CSSProperties => {
    switch (frameStyle) {
      case "scallop":
        return {
          padding: `${framePadding}px`,
          backgroundColor: "#fff0f5",
          outline: "3px dashed #ffb6c1",
          outlineOffset: `-${Math.max(2, framePadding / 2)}px`,
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(255, 182, 193, 0.3)",
        };
      case "floral":
        return {
          padding: `${framePadding}px`,
          backgroundColor: "#fcf8f2",
          border: `${Math.max(3, framePadding / 3)}px solid #d4a373`,
          borderRadius: "12px",
          boxShadow: "inset 0 0 0 2px #faedcd, 0 6px 18px rgba(0,0,0,0.08)",
        };
      case "hearts":
        return {
          padding: `${framePadding}px`,
          backgroundColor: "#ffe6e8",
          border: `${Math.max(2, framePadding / 4)}px dotted #ff4d6d`,
          borderRadius: "20px",
          boxShadow: "0 6px 16px rgba(255, 77, 109, 0.2)",
        };
      case "washi":
        return {
          padding: `${framePadding}px`,
          backgroundColor: "#f7f0e5",
          border: `${Math.max(2, framePadding / 3)}px double #b08968`,
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(107, 76, 42, 0.15)",
        };
      case "classic":
      default:
        return {
          padding: `${framePadding}px`,
          backgroundColor: "#ffffff",
          border: `${Math.max(1, framePadding / 6)}px solid #f0f0f0`,
          borderRadius: "8px",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative p-5 pb-7 bg-white rounded-2xl shadow-2xl max-w-lg w-full cursor-default max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-10 cursor-pointer"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* Customizable Photo Frame Container */}
        <div className="relative w-full mb-4 flex justify-center">
          <div
            className="transition-all duration-200 relative inline-block max-w-full"
            style={getFrameStyles()}
          >
            {frameStyle === "hearts" && (
              <span className="absolute top-1 left-2 text-xs pointer-events-none z-10">
                💖
              </span>
            )}
            {frameStyle === "floral" && (
              <span className="absolute top-1 right-2 text-xs pointer-events-none z-10">
                🌸
              </span>
            )}
            {frameStyle === "scallop" && (
              <span className="absolute bottom-1 right-2 text-xs pointer-events-none z-10">
                🎀
              </span>
            )}

            {/* Photo wrapper adapts to original aspect ratio */}
            <div className="relative w-full max-h-[60vh] flex items-center justify-center bg-neutral-100/50 rounded overflow-hidden shadow-inner">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedPhoto.id}
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-full max-h-[60vh] w-auto h-auto object-contain block rounded"
                />
              </AnimatePresence>

              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={onPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all shadow-md focus:outline-none cursor-pointer z-10"
                  title="Previous photo"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={onNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all shadow-md focus:outline-none cursor-pointer z-10"
                  title="Next photo"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Customization Toolbar */}
        <div
          className="mb-4 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/50 flex flex-col gap-2 font-sans"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          <div className="flex items-center justify-between gap-1 text-xs">
            <span className="text-[#6b4c2a] font-semibold flex items-center gap-1 shrink-0">
              <Frame size={13} /> Frame Style:
            </span>
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: "classic", label: "Classic" },
                { id: "scallop", label: "Pink 🎀" },
                { id: "floral", label: "Floral 🌸" },
                { id: "hearts", label: "Hearts 💕" },
                { id: "washi", label: "Cozy ☕" },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setFrameStyle(style.id as FrameStyle)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                    frameStyle === style.id
                      ? "bg-[#6b4c2a] text-white shadow-sm"
                      : "bg-white/80 text-[#6b4c2a] hover:bg-white border border-[#6b4c2a]/20"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6b4c2a]">
            <span className="font-semibold flex items-center gap-1 shrink-0">
              <SlidersHorizontal size={13} /> Frame Size:
            </span>
            <input
              type="range"
              min="4"
              max="28"
              value={framePadding}
              onChange={(e) => setFramePadding(Number(e.target.value))}
              className="w-full accent-[#6b4c2a] cursor-pointer h-1.5 bg-amber-200/60 rounded-lg appearance-none"
            />
            <span className="text-[10px] w-6 text-right text-[#6b4c2a]/70 font-mono">
              {framePadding}px
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-baseline justify-between px-1">
          <p className="text-2xl font-bold text-gray-800 leading-tight">
            {selectedPhoto.caption}
          </p>
          {photos.length > 1 && selectedIndex !== -1 && (
            <span className="text-xs font-sans text-gray-400 font-medium shrink-0 ml-2">
              {selectedIndex + 1} / {photos.length}
            </span>
          )}
        </div>

        {selectedPhoto.date && (
          <p className="text-sm text-gray-400 mt-0.5 px-1 font-sans">
            {selectedPhoto.date}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
