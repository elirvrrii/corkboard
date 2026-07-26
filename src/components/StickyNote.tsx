// src/components/StickyNote.tsx
import { useState } from "react";
import { motion } from "motion/react";
import type { Note } from "../types/note";
import { Pushpin } from "./PushPin";

export function StickyNote({
  note,
  onClick,
}: {
  note: Note;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  // Compute a balanced tilt: forces even IDs to lean left (-deg) and odd IDs to lean right (+deg)
  const baseAngle = Math.abs(note.rotate || 6);
  const isEvenId =
    typeof note.id === "string"
      ? note.id.charCodeAt(note.id.length - 1) % 2 === 0
      : Number(note.id) % 2 === 0;

  const computedRotation = isEvenId ? -baseAngle : baseAngle;

  return (
    <motion.div
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
        rotate: `${computedRotation}deg`,
        width: "clamp(120px, 12vw, 160px)",
        zIndex: hovered ? 50 : 10,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute cursor-pointer select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Pushpin sitting comfortably above the paper container without being clipped */}
      <Pushpin color={note.pinColor} />

      <div
        className="rounded-sm pt-5 pb-4 px-4 relative overflow-hidden flex flex-col justify-between min-h-[105px]"
        style={{
          background: note.color,
          boxShadow: hovered
            ? "0 16px 36px rgba(80,40,10,0.20), 0 4px 10px rgba(80,40,10,0.12)"
            : "0 4px 14px rgba(80,40,10,0.14), 0 2px 5px rgba(80,40,10,0.08)",
          transition: "box-shadow 0.15s ease-out",
        }}
      >
        {/* Paper fold accent */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 50%)`,
          }}
        />

        {/* To section */}
        <div>
          <span
            className="text-[9px] font-semibold tracking-widest uppercase block"
            style={{
              fontFamily: "'Nunito', sans-serif",
              color: "rgba(61,31,14,0.45)",
            }}
          >
            To:
          </span>
          <p
            className="text-xs font-bold truncate"
            style={{
              fontFamily: "'Nunito', sans-serif",
              color: "rgba(61,31,14,0.85)",
            }}
          >
            {note.to}
          </p>
        </div>

        <div
          className="w-full h-px my-1.5"
          style={{ background: "rgba(61,31,14,0.12)" }}
        />

        {/* From section */}
        <div className="text-right">
          <span
            className="text-[9px] font-semibold tracking-widest uppercase block"
            style={{
              fontFamily: "'Nunito', sans-serif",
              color: "rgba(61,31,14,0.45)",
            }}
          >
            From:
          </span>
          <p
            className="text-xs font-semibold truncate"
            style={{
              fontFamily: "'Caveat', cursive",
              color: "rgba(61,31,14,0.85)",
            }}
          >
            {note.from || "Anonymous"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
