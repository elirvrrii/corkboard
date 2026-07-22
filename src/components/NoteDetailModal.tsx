import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Note } from "../types/note";
import { CartoonPin } from "./CartoonPin";

interface NoteDetailModalProps {
  note: Note;
  onClose: () => void;
}

export function NoteDetailModal({ note, onClose }: NoteDetailModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backdropFilter: "blur(8px)", background: "rgba(61,31,14,0.4)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, rotate: note.rotate * 3, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="relative max-w-sm w-full rounded-2xl pt-10 pb-6 px-6"
        style={{
          background: note.color,
          border: "3.5px solid #3d1f0e",
          boxShadow: "6px 6px 0px #3d1f0e",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CartoonPin color={note.pinColor} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full transition-all"
          style={{
            background: "rgba(61,31,14,0.12)",
            border: "2px solid #3d1f0e",
            color: "#3d1f0e",
          }}
        >
          <X size={14} />
        </button>

        <div className="mb-3">
          <div
            className="text-xs font-black uppercase tracking-widest mb-0.5"
            style={{
              fontFamily: "'Nunito', sans-serif",
              color: "#3d1f0e",
              opacity: 0.6,
            }}
          >
            To
          </div>
          <div
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "26px",
              fontWeight: 700,
              color: "#3d1f0e",
            }}
          >
            {note.to}
          </div>
        </div>

        <div
          className="w-full h-0.5 my-3 rounded-full"
          style={{ background: "rgba(61,31,14,0.2)" }}
        />

        <div className="relative mb-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-full h-px mb-6"
              style={{ background: "rgba(61,31,14,0.13)" }}
            />
          ))}
          <p
            className="absolute top-0 left-0 right-0 leading-relaxed"
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "19px",
              color: "#3d1f0e",
              lineHeight: "1.7rem",
            }}
          >
            {note.message}
          </p>
        </div>

        <div
          className="w-full h-0.5 mb-3 rounded-full"
          style={{ background: "rgba(61,31,14,0.2)" }}
        />

        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-xs font-black uppercase tracking-widest"
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: "#3d1f0e",
                opacity: 0.6,
              }}
            >
              From
            </div>
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "22px",
                fontWeight: 600,
                color: "#3d1f0e",
              }}
            >
              {note.from}
            </div>
          </div>
          {note.tag && (
            <span
              className="text-xs px-2 py-1 rounded-full font-black"
              style={{
                background: "rgba(61,31,14,0.13)",
                color: "#3d1f0e",
                fontFamily: "'Nunito', sans-serif",
                border: "2px solid rgba(61,31,14,0.3)",
              }}
            >
              #{note.tag}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
