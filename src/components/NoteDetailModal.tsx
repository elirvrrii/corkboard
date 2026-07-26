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
        className="relative max-w-sm w-full rounded-sm pt-10 pb-7 px-7 shadow-2xl"
        style={{
          background: note.color,
          boxShadow:
            "0 24px 60px rgba(40,20,5,0.4), 0 6px 20px rgba(40,20,5,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Pushpin color={note.pinColor} />
        <div
          className="absolute bottom-0 right-0 w-8 h-8"
          style={{
            background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 50%)`,
          }}
        />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 transition-all"
          style={{ color: "#5a3e28" }}
        >
          <X size={15} />
        </button>

        <div className="mb-3">
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
          className="w-full h-px my-3"
          style={{ background: "rgba(61,31,14,0.15)" }}
        />

        <div className="relative mb-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-full h-px mb-7"
              style={{ background: "rgba(61,31,14,0.1)" }}
            />
          ))}
          <div className="absolute top-0 left-0 right-0 space-y-3">
            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "20px",
                color: "#2c1a0e",
                lineHeight: "1.85rem",
              }}
            >
              {note.message}
            </p>
            {note.ps && (
              <p
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "18px",
                  color: "rgba(61,31,14,0.85)",
                  fontStyle: "italic",
                  lineHeight: "1.6rem",
                }}
              >
                P.S. {note.ps}
              </p>
            )}
          </div>
        </div>

        <div
          className="w-full h-px mb-4"
          style={{ background: "rgba(61,31,14,0.15)" }}
        />

        <div className="flex items-center justify-between">
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
