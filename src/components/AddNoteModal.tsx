import { useState } from "react";
import { X, Pin } from "lucide-react";
import { motion } from "motion/react";
import type { Note } from "../types/note";

const NOTE_COLORS = [
  "#fef9c3",
  "#dcfce7",
  "#ffedd5",
  "#ede9fe",
  "#fce7f3",
  "#d1fae5",
  "#e0f2fe",
  "#fef3c7",
];
const PIN_COLORS = [
  "#f87171",
  "#86efac",
  "#fdba74",
  "#c4b5fd",
  "#f9a8d4",
  "#6ee7b7",
];

export function AddNoteModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (n: Omit<Note, "id" | "x" | "y" | "rotate">) => void;
}) {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [ps, setPs] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [pin, setPin] = useState(PIN_COLORS[0]);

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Caveat', cursive",
    fontSize: "18px",
    background: "rgba(200,168,75,0.10)",
    border: "1.5px solid rgba(139,99,59,0.22)",
    color: "#2c1a0e",
    borderRadius: "10px",
    outline: "none",
    padding: "8px 12px",
    width: "100%",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || !message.trim()) return;

    onAdd({
      to: to.trim(),
      from: from.trim() || "Anonymous",
      message: message.trim(),
      color,
      pinColor: pin,
      ps: ps.trim() || undefined,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(60,30,10,0.35)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="relative max-w-md w-full rounded-2xl p-8 shadow-2xl"
        style={{
          background: "#fdf8ef",
          border: "1px solid rgba(139,99,59,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-7 rounded-sm"
          style={{ background: "rgba(200,168,75,0.55)" }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 transition-all"
          style={{ color: "#5a3e28" }}
        >
          <X size={15} />
        </button>

        <h2
          className="mb-6 mt-1"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px",
            color: "#2c1a0e",
          }}
        >
          Pin a new note ✍️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest mb-1"
              style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
            >
              To
            </label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Who's this for?"
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest mb-1"
              style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
            >
              From
            </label>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Your name (or stay mysterious)"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest mb-1"
              style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
            >
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What do you want to say?"
              required
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest mb-1"
              style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
            >
              P.S. (optional)
            </label>
            <input
              value={ps}
              onChange={(e) => setPs(e.target.value)}
              placeholder="Don't forget to bring tea, see you at 5, etc."
              style={inputStyle}
            />
          </div>

          <div className="flex gap-4 pt-1">
            <div className="flex-1">
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
              >
                Note
              </label>
              <div className="flex gap-2 flex-wrap">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: c,
                      boxShadow:
                        color === c
                          ? `0 0 0 2px #6b4c2a, 0 0 0 3.5px ${c}`
                          : "0 1px 4px rgba(0,0,0,0.15)",
                      border: "1px solid rgba(61,31,14,0.2)",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
              >
                Pin
              </label>
              <div className="flex gap-2 flex-wrap">
                {PIN_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPin(c)}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: c,
                      boxShadow:
                        pin === c
                          ? `0 0 0 2px #6b4c2a, 0 0 0 3.5px ${c}`
                          : "0 1px 4px rgba(0,0,0,0.15)",
                      border: "1px solid rgba(61,31,14,0.2)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold transition-all duration-200 hover:brightness-105 active:scale-95 mt-1 flex items-center justify-center gap-2"
            style={{
              background: "#6b4c2a",
              color: "#fdf8ef",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "15px",
              boxShadow: "0 4px 14px rgba(107,76,42,0.35)",
            }}
          >
            <Pin size={13} /> Pin it!
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
