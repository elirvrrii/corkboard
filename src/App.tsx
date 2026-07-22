import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ref, onValue, push, serverTimestamp } from "firebase/database";
import { db } from "./firebase";

import type { Note } from "./types/note";
import { SHADOW_SM } from "./constants/colors";
import { StickyNote } from "./components/StickyNote";
import { IntroModal } from "./components/IntroModal";
import { NoteDetailModal } from "./components/NoteDetailModal";
import { AddNoteModal } from "./components/AddNoteModal";
import { WallScene } from "./components/WallScene";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const notesRef = ref(db, "notes");
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedNotes: Note[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setNotes(fetchedNotes);
      } else {
        setNotes([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNote = async (
    noteData: Omit<Note, "id" | "x" | "y" | "rotate">,
  ) => {
    const x = Math.floor(Math.random() * 70) + 5;
    const y = Math.floor(Math.random() * 55) + 5;
    const rotate = Math.floor((Math.random() - 0.5) * 10);

    const notesRef = ref(db, "notes");
    await push(notesRef, {
      ...noteData,
      x,
      y,
      rotate,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div
      className="size-full relative overflow-hidden"
      style={{ background: "#f5ead6" }}
    >
      <WallScene />

      <div className="relative z-10 size-full flex flex-col items-center justify-center">
        <div
          className="w-full flex items-center justify-between px-8 py-3"
          style={{ maxWidth: "1100px" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "22px" }}>📌</span>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(16px, 2vw, 22px)",
                color: "#3d1f0e",
              }}
            >
              Ren&apos;s Corkboard
            </h1>
          </div>
          <motion.button
            onClick={() => setShowAddModal(true)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-black"
            style={{
              background: "#92400e",
              color: "#fffbef",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "14px",
              border: "3px solid #3d1f0e",
              boxShadow: SHADOW_SM,
            }}
          >
            <Plus size={16} />
            Add a note
          </motion.button>
        </div>

        <div
          className="flex-1 w-full relative"
          style={{ maxWidth: "1100px", padding: "0 24px 24px" }}
        >
          <div
            className="w-full h-full rounded-2xl"
            style={{
              background: "#d4914a",
              border: "4px solid #3d1f0e",
              boxShadow: "6px 6px 0px #3d1f0e",
              padding: "16px",
            }}
          >
            <div
              className="absolute top-5 left-8 right-8 h-2 rounded-full opacity-25 pointer-events-none"
              style={{ background: "#fff8e1" }}
            />

            <div
              className="relative w-full overflow-hidden rounded-xl flex items-center justify-center"
              style={{
                height: "calc(100vh - 155px)",
                minHeight: "380px",
                background: "#c8974f",
                border: "3px solid #3d1f0e",
                boxShadow: "inset 0 2px 12px rgba(61,31,14,0.3)",
              }}
            >
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #7a4a1e 1px, transparent 1px)`,
                  backgroundSize: "18px 18px",
                }}
              />

              {loading ? (
                <div
                  className="flex items-center gap-2 font-bold"
                  style={{
                    color: "#3d1f0e",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  <Loader2 className="animate-spin" size={20} />
                  Loading corkboard...
                </div>
              ) : notes.length === 0 ? (
                <div
                  className="text-center font-bold opacity-60"
                  style={{
                    color: "#3d1f0e",
                    fontFamily: "'Caveat', cursive",
                    fontSize: "24px",
                  }}
                >
                  The corkboard is empty! Be the first to pin a note. 📌
                </div>
              ) : (
                notes.map((note) => (
                  <StickyNote
                    key={note.id}
                    note={note}
                    onClick={() => setSelectedNote(note)}
                  />
                ))
              )}

              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-center pointer-events-none font-bold"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: "rgba(255,248,225,0.5)",
                  letterSpacing: "0.08em",
                }}
              >
                hover to peek · click to read
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {selectedNote && (
          <NoteDetailModal
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddModal && (
          <AddNoteModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddNote}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
