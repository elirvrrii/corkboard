import { Coffee, Heart } from "lucide-react";
import { motion } from "motion/react";

export function IntroModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(80,45,15,0.35)",
      }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="relative max-w-md w-full rounded-2xl p-8 shadow-2xl"
        style={{
          background: "#fdf8ef",
          border: "1px solid rgba(139,99,59,0.18)",
        }}
      >
        {/* tape */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-7 rounded-sm"
          style={{
            background: "rgba(200,168,75,0.55)",
            backdropFilter: "blur(2px)",
          }}
        />

        <div className="flex items-center gap-2 mb-5 mt-1">
          <Coffee size={18} style={{ color: "#92400e" }} />
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
          >
            Welcome
          </span>
        </div>

        <h1
          className="mb-4 leading-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(22px, 4vw, 29px)",
            color: "#2c1a0e",
          }}
        >
          Miss you guys! ☕
        </h1>

        <p
          className="mb-3 leading-relaxed"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "19px",
            color: "#4a3020",
          }}
        >
          Hi besties! I made this small corkboard app as an appreciation for our
          internship. I never expected internship to be fun not only because of
          what I learned throughout this period, but also because of the people
          I met. Hindi ako nakapag sign sa inyo sa notebook so dito nalang
          hahaha.
        </p>
        <p
          className="mb-6 leading-relaxed"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "19px",
            color: "#4a3020",
          }}
        >
          Feel free to look around, read the notes, and please leave one of your
          own, either for me or for others. Messages or small affirmations would
          do. I wish you all the best on your thesis and future exams.
        </p>
        <p
          className="mb-6 leading-relaxed"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "19px",
            color: "#4a3020",
          }}
        >
          - Angelique
        </p>

        <div
          className="flex items-center gap-2 text-xs mb-6 p-3 rounded-xl"
          style={{
            background: "rgba(200,168,75,0.15)",
            color: "#6b4c2a",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            border: "1px solid rgba(200,168,75,0.3)",
          }}
        >
          <Heart size={12} fill="#f87171" color="#f87171" />
          <span>
            Click any note to read it fully. Use the + button to add your own.
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold transition-all duration-200 hover:brightness-105 active:scale-95"
          style={{
            background: "#6b4c2a",
            color: "#fdf8ef",
            fontFamily: "'Nunito', sans-serif",
            fontSize: "15px",
            boxShadow: "0 4px 14px rgba(107,76,42,0.35)",
          }}
        >
          Come on in →
        </button>
      </motion.div>
    </motion.div>
  );
}
