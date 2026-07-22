import { useState } from "react";
import { motion } from "framer-motion";
import type { Note } from "../types/note";
import { OUTLINE, SHADOW } from "../constants/colors";
import { CartoonPin } from "./CartoonPin";

interface StickyNoteProps {
  note: Note;
  onClick: () => void;
}

export function StickyNote({ note, onClick }: StickyNoteProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="absolute cursor-pointer select-none"
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
        rotate: `${note.rotate}deg`,
        width: "clamp(130px, 14vw, 185px)",
        zIndex: hovered ? 50 : 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 0 }}
      whileTap={{ scale: 0.95 }}
    >
      <CartoonPin color={note.pinColor} />
      <div
        className="rounded-xl pt-4 pb-4 px-4 relative"
        style={{
          background: note.color,
          border: OUTLINE,
          boxShadow: SHADOW,
        }}
      >
        <div
          className="text-[10px] font-black uppercase tracking-widest mb-1"
          style={{
            fontFamily: "'Nunito', sans-serif",
            color: "rgba(61,31,14,0.5)",
          }}
        >
          To: <span style={{ color: "#3d1f0e" }}>{note.to}</span>
        </div>

        <div
          className="w-full h-px mb-2"
          style={{ background: "rgba(61,31,14,0.15)" }}
        />

        <p
          className="leading-snug line-clamp-3"
          style={{
            fontFamily: "'Caveat', cursive",
            color: "#3d1f0e",
            fontSize: "clamp(13px, 1.2vw, 15px)",
          }}
        >
          {note.message}
        </p>

        {note.tag && (
          <span
            className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={{
              background: "rgba(61,31,14,0.12)",
              color: "#3d1f0e",
              fontFamily: "'Nunito', sans-serif",
              border: "1.5px solid rgba(61,31,14,0.25)",
            }}
          >
            #{note.tag}
          </span>
        )}
      </div>
    </motion.div>
  );
}
