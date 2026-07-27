import { X } from "lucide-react";
import { motion } from "motion/react";
import type { Note } from "../types/note";
import { Pushpin } from "./PushPin";

export function NoteDetailModal({
  note,
  onClose,
}: {
  note: Note;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backdropFilter: "blur(10px)", background: "rgba(60,30,10,0.4)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, rotate: note.rotate * 2, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 24 }}
        className="relative max-w-sm w-full rounded-sm pt-10 pb-7 px-7 shadow-2xl max-h-[85vh] flex flex-col"
        style={{
          background: note.color,
          boxShadow:
            "0 24px 60px rgba(40,20,5,0.4), 0 6px 20px rgba(40,20,5,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Pushpin color={note.pinColor} />

        <div
          className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 50%)`,
          }}
        />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 transition-all z-10"
          style={{ color: "#5a3e28" }}
        >
          <X size={15} />
        </button>

        {/* Header Section */}
        <div className="mb-3 shrink-0">
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
            style={{
              fontFamily: "'Nunito', sans-serif",
              color: "rgba(61,31,14,0.5)",
            }}
          >
            To
          </div>
          <div
            className="break-words"
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "26px",
              fontWeight: 700,
              color: "#2c1a0e",
            }}
          >
            {note.to}
          </div>
        </div>

        <div
          className="w-full h-px my-3 shrink-0"
          style={{ background: "rgba(61,31,14,0.15)" }}
        />

        {/* Scrollable Body with Dynamic Lined Background */}
        <div className="mb-5 overflow-y-auto pr-1 custom-scrollbar">
          <div
            className="w-full"
            style={{
              // Repeating linear-gradient generates ruled lines matching the line-height (2rem / 32px)
              backgroundImage:
                "linear-gradient(transparent 31px, rgba(61,31,14,0.12) 31px)",
              backgroundSize: "100% 32px",
            }}
          >
            <p
              className="whitespace-pre-wrap break-words"
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "20px",
                color: "#2c1a0e",
                lineHeight: "32px",
              }}
            >
              {note.message}
            </p>
            {note.ps && (
              <p
                className="mt-4 whitespace-pre-wrap break-words"
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "18px",
                  color: "rgba(61,31,14,0.85)",
                  fontStyle: "italic",
                  lineHeight: "32px",
                }}
              >
                P.S. {note.ps}
              </p>
            )}
          </div>
        </div>

        <div
          className="w-full h-px mb-4 shrink-0"
          style={{ background: "rgba(61,31,14,0.15)" }}
        />

        {/* Footer Section */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <div
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: "rgba(61,31,14,0.5)",
              }}
            >
              From
            </div>
            <div
              className="break-words"
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "21px",
                fontWeight: 600,
                color: "#2c1a0e",
              }}
            >
              {note.from}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
