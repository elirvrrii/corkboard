import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import type { Note } from "../types/note";
import { NOTE_COLORS, PIN_COLORS } from "../constants/colors";

interface AddNoteModalProps {
  onClose: () => void;
  onAdd: (note: Omit<Note, "id" | "x" | "y" | "rotate">) => Promise<void>;
}

export function AddNoteModal({ onClose, onAdd }: AddNoteModalProps) {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [tag, setTag] = useState("");
  const [chosenColor, setChosenColor] = useState(NOTE_COLORS[0]);
  const [chosenPin, setChosenPin] = useState(PIN_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        to: to.trim(),
        from: from.trim() || "Anonymous",
        message: message.trim(),
        color: chosenColor,
        pinColor: chosenPin,
        tag: tag.trim() || undefined,
      });
      onClose();
    } catch (err) {
      console.error("Error creating note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    fontFamily: "'Caveat', cursive",
    fontSize: "18px",
    background: "#fffbef",
    border: "2.5px solid #3d1f0e",
    boxShadow: "3px 3px 0px #3d1f0e",
    color: "#3d1f0e",
    borderRadius: "10px",
    outline: "none",
    padding: "8px 12px",
    width: "100%",
  };

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
        initial={{ scale: 0.85, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative max-w-md w-full rounded-2xl p-8"
        style={{
          background: "#fffbef",
          border: "3.5px solid #3d1f0e",
          boxShadow: "6px 6px 0px #3d1f0e",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-7 rounded-md opacity-75"
          style={{
            background: "#bbf7d0",
            border: "2px solid #3d1f0e",
            boxShadow: "2px 2px 0px #3d1f0e",
          }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full"
          style={{
            background: "rgba(61,31,14,0.1)",
            border: "2px solid #3d1f0e",
            color: "#3d1f0e",
          }}
        >
          <X size={14} />
        </button>

        <h2
          className="mb-5 mt-1"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px",
            color: "#3d1f0e",
          }}
        >
          Pin a new note ✍️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              className="block text-xs font-black uppercase tracking-widest mb-1"
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
              className="block text-xs font-black uppercase tracking-widest mb-1"
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
              className="block text-xs font-black uppercase tracking-widest mb-1"
              style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
            >
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What do you want to say?"
              required
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>
          <div>
            <label
              className="block text-xs font-black uppercase tracking-widest mb-1"
              style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
            >
              Tag (optional)
            </label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="reminder, plans, affirmation…"
              style={inputStyle}
            />
          </div>

          <div className="flex gap-4 pt-1">
            <div className="flex-1">
              <label
                className="block text-xs font-black uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
              >
                Note
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChosenColor(c)}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: c,
                      border:
                        chosenColor === c
                          ? "3px solid #3d1f0e"
                          : "2px solid rgba(61,31,14,0.3)",
                      boxShadow:
                        chosenColor === c ? "2px 2px 0 #3d1f0e" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label
                className="block text-xs font-black uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Nunito', sans-serif", color: "#92400e" }}
              >
                Pin
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {PIN_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChosenPin(c)}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: c,
                      border:
                        chosenPin === c
                          ? "3px solid #3d1f0e"
                          : "2px solid rgba(61,31,14,0.3)",
                      boxShadow: chosenPin === c ? "2px 2px 0 #3d1f0e" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-black transition-all duration-100 mt-2 hover:translate-y-0.5 flex items-center justify-center gap-2"
            style={{
              background: "#92400e",
              color: "#fffbef",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "16px",
              border: "3px solid #3d1f0e",
              boxShadow: "4px 4px 0px #3d1f0e",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "📌 Pin it!"
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
