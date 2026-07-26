// src/components/SpotifyPlayer.tsx
import { useState } from "react";
import { Music, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SpotifyPlayerProps {
  // Replace with your default Spotify playlist ID
  playlistId?: string;
}

export function SpotifyPlayer({
  playlistId = "37i9dQZF1EIfSRFdVoSGqU",
}: SpotifyPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-2xl shadow-2xl border border-[#6b4c2a]/20 bg-[#fdf8ef]"
            style={{ width: "300px", height: "152px" }}
          >
            <iframe
              title="Spotify Playlist"
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full font-semibold shadow-lg text-xs"
        style={{
          background: "#6b4c2a",
          color: "#fdf8ef",
          fontFamily: "'Nunito', sans-serif",
          boxShadow: "0 4px 14px rgba(61,31,14,0.3)",
        }}
      >
        {isOpen ? <X size={14} /> : <Music size={14} />}
        <span>{isOpen ? "Close Music" : "Cozy Tunes"}</span>
      </motion.button>
    </div>
  );
}
