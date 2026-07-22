import { motion } from "framer-motion";
import { Coffee, Heart } from "lucide-react";

export function IntroModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backdropFilter: "blur(8px)", background: "rgba(61,31,14,0.35)" }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative max-w-md w-full rounded-2xl p-8"
        style={{
          background: "#fffbef",
          border: "3.5px solid #3d1f0e",
          boxShadow: "6px 6px 0px #3d1f0e",
        }}
      >
        <div
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-16 h-8 rounded-md opacity-80"
          style={{
            background: "#fde68a",
            border: "2px solid #3d1f0e",
            boxShadow: "2px 2px 0px #3d1f0e",
          }}
        />

        <div className="flex items-center gap-2 mb-4 mt-1">
          <Coffee size={20} style={{ color: "#92400e" }} />
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
          >
            Welcome!
          </span>
        </div>

        <h1
          className="mb-4 leading-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(22px, 4vw, 28px)",
            color: "#3d1f0e",
          }}
        >
          Hey there, grab a seat. ☕
        </h1>

        <p
          className="mb-3 leading-relaxed"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "19px",
            color: "#5c3518",
          }}
        >
          This is my little corkboard — a cozy corner of the internet where I
          collect notes from friends, reminders to myself, and the occasional
          mystery message from a stranger.
        </p>

        <p
          className="mb-5 leading-relaxed"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "19px",
            color: "#5c3518",
          }}
        >
          Feel free to look around, read the notes, and leave one of your own.
          The cork's warm and there's always room for one more pin. 📌
        </p>

        <div
          className="flex items-center gap-2 text-xs mb-6 p-3 rounded-xl"
          style={{
            background: "#fef9c3",
            border: "2px solid #3d1f0e",
            color: "#5c3518",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
          }}
        >
          <Heart size={12} fill="#f87171" color="#f87171" />
          <span>
            Click any note to read it fully. Use the + button to add your own.
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-black transition-all duration-150 hover:translate-y-0.5 active:translate-y-1"
          style={{
            background: "#92400e",
            color: "#fffbef",
            fontFamily: "'Nunito', sans-serif",
            fontSize: "16px",
            border: "3px solid #3d1f0e",
            boxShadow: "4px 4px 0px #3d1f0e",
          }}
        >
          Come on in →
        </button>
      </motion.div>
    </motion.div>
  );
}
