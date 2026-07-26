import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Plus,
  Coffee,
  Search,
  X,
  HelpCircle,
  Music,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { onValue, push } from "firebase/database";
import { notesRef, photosRef } from "./firebase";
import type { Note } from "./types/note";
import { StickyNote } from "./components/StickyNote";
import { IntroModal } from "./components/IntroModal";
import { NoteDetailModal } from "./components/NoteDetailModal";
import { AddNoteModal } from "./components/AddNoteModal";
import { WallScene } from "./components/WallScene";
import { PolaroidGallery } from "./components/PolaroidGallery";

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
    SpotifyIFrameAPI?: any;
  }
}

export interface PolaroidPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
  rotate?: number;
}

const BLANK_PHOTO_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect width='500' height='500' fill='%23f3ead9'/%3E%3Crect x='20' y='20' width='460' height='460' fill='none' stroke='%23c9b896' stroke-width='4' stroke-dasharray='12 10'/%3E%3Cg transform='translate(250,230)' fill='%23c9b896'%3E%3Crect x='-70' y='-40' width='140' height='100' rx='10'/%3E%3Ccircle cx='0' cy='10' r='32' fill='%23f3ead9'/%3E%3Crect x='-20' y='-58' width='40' height='22' rx='6'/%3E%3C/g%3E%3C/svg%3E";

const DEFAULT_PHOTOS: PolaroidPhoto[] = [
  {
    id: "p1",
    url: BLANK_PHOTO_URL,
    caption: "",
  },
];

const STICKERS = [
  { id: "s1", emoji: "🌸", x: 12, y: 15, rotate: -15, scale: 1.2 },
  { id: "s2", emoji: "☕", x: 84, y: 18, rotate: 12, scale: 1.1 },
  { id: "s3", emoji: "✨", x: 45, y: 8, rotate: -8, scale: 1.0 },
  { id: "s4", emoji: "🧸", x: 88, y: 72, rotate: -20, scale: 1.3 },
  { id: "s5", emoji: "🎀", x: 6, y: 78, rotate: 18, scale: 1.2 },
  { id: "s6", emoji: "🍀", x: 75, y: 45, rotate: 10, scale: 1.0 },
  { id: "s7", emoji: "🍓", x: 22, y: 52, rotate: -12, scale: 1.1 },
  { id: "s8", emoji: "💌", x: 52, y: 82, rotate: 15, scale: 1.2 },
];

const WASHI_TAPES = [
  {
    id: "wt1",
    x: 3,
    y: 5,
    rotate: -25,
    color: "rgba(255, 182, 193, 0.65)",
    width: 75,
  },
  {
    id: "wt2",
    x: 88,
    y: 4,
    rotate: 20,
    color: "rgba(176, 224, 230, 0.65)",
    width: 85,
  },
  {
    id: "wt3",
    x: 92,
    y: 88,
    rotate: -15,
    color: "rgba(255, 239, 184, 0.7)",
    width: 70,
  },
  {
    id: "wt4",
    x: 4,
    y: 86,
    rotate: 12,
    color: "rgba(216, 191, 216, 0.65)",
    width: 80,
  },
];

const GARLAND_FLAGS = [
  { id: "gf1", color: "#ffb7b2", rotate: -5 },
  { id: "gf2", color: "#ffdac1", rotate: 3 },
  { id: "gf3", color: "#e2f0cb", rotate: -3 },
  { id: "gf4", color: "#b5ead7", rotate: 4 },
  { id: "gf5", color: "#c7ceea", rotate: -2 },
];

// Extracted Detail Photo Modal
interface DetailPhotoModalProps {
  selectedPhoto: PolaroidPhoto;
  photos: PolaroidPhoto[];
  selectedIndex: number;
  onClose: () => void;
  onPrev: (e?: React.MouseEvent) => void;
  onNext: (e?: React.MouseEvent) => void;
}

function DetailPhotoModal({
  selectedPhoto,
  photos,
  selectedIndex,
  onClose,
  onPrev,
  onNext,
}: DetailPhotoModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-white p-4 pb-6 rounded-lg shadow-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: "'Caveat', cursive, sans-serif",
          width: "fit-content",
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 p-1.5 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100 z-10 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Image scales to fit within bounds, keeping its natural aspect ratio */}
        <div className="relative flex items-center justify-center rounded mb-4 bg-gray-100">
          <img
            src={selectedPhoto.url}
            alt={selectedPhoto.caption}
            className="rounded block"
            style={{
              maxWidth: "min(80vw, 480px)",
              maxHeight: "62vh",
              width: "auto",
              height: "auto",
            }}
          />

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all shadow-md focus:outline-none cursor-pointer"
                title="Previous photo (←)"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={onNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all shadow-md focus:outline-none cursor-pointer"
                title="Next photo (→)"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        <div className="flex items-baseline justify-between px-2">
          <p className="text-2xl font-bold text-gray-800 leading-tight">
            {selectedPhoto.caption}
          </p>

          {photos.length > 1 && selectedIndex !== -1 && (
            <span className="text-xs font-sans text-gray-400 font-medium shrink-0 ml-2">
              {selectedIndex + 1} / {photos.length}
            </span>
          )}
        </div>

        {selectedPhoto.date && (
          <p className="text-sm text-gray-400 mt-1 px-2 font-sans">
            {selectedPhoto.date}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [photos, setPhotos] = useState<PolaroidPhoto[]>(DEFAULT_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidPhoto | null>(
    null,
  );
  const [showAdd, setShowAdd] = useState(false);
  const [showMusic, setShowMusic] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const embedControllerRef = useRef<any>(null);
  const spotifyEmbedContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize Spotify iFrame API
  useEffect(() => {
    const initSpotify = (IFrameAPI: any) => {
      const element = spotifyEmbedContainerRef.current;
      if (!element || embedControllerRef.current) return;

      const options = {
        uri: "spotify:playlist:37i9dQZF1EIfSRFdVoSGqU",
        width: "100%",
        height: "152",
      };

      IFrameAPI.createController(element, options, (EmbedController: any) => {
        embedControllerRef.current = EmbedController;
      });
    };

    if (window.SpotifyIFrameAPI) {
      initSpotify(window.SpotifyIFrameAPI);
    } else {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        window.SpotifyIFrameAPI = IFrameAPI;
        initSpotify(IFrameAPI);
      };

      const existingScript = document.getElementById("spotify-iframe-api");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "spotify-iframe-api";
        script.src = "https://open.spotify.com/embed/iframe-api/v1";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  // Trigger Playback when Intro Modal is closed
  const handleCloseIntro = useCallback(() => {
    setShowIntro(false);
    if (embedControllerRef.current) {
      embedControllerRef.current.play();
    }
  }, []);

  // Firebase Listener for Notes
  useEffect(() => {
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedNotes = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setNotes(loadedNotes);
      } else {
        setNotes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase Listener for Polaroid Photos
  useEffect(() => {
    const unsubscribe = onValue(photosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const firebasePhotos: PolaroidPhoto[] = Object.keys(data).map(
          (key) => ({
            id: key,
            ...data[key],
          }),
        );
        setPhotos(firebasePhotos);
      } else {
        setPhotos(DEFAULT_PHOTOS);
      }
    });

    return () => unsubscribe();
  }, []);

  // Calculate index of selected photo
  const selectedIndex = selectedPhoto
    ? photos.findIndex((p) => p.id === selectedPhoto.id)
    : -1;

  // Next / Previous Navigation Handlers
  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (selectedIndex === -1 || photos.length <= 1) return;
      const prevIndex = (selectedIndex - 1 + photos.length) % photos.length;
      setSelectedPhoto(photos[prevIndex]);
    },
    [selectedIndex, photos],
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (selectedIndex === -1 || photos.length <= 1) return;
      const nextIndex = (selectedIndex + 1) % photos.length;
      setSelectedPhoto(photos[nextIndex]);
    },
    [selectedIndex, photos],
  );

  // Keyboard Arrow & Escape support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, handlePrev, handleNext]);

  const handleAdd = useCallback(
    async (data: Omit<Note, "id" | "x" | "y" | "rotate">) => {
      // Reserve the top-left corner where the polaroid gallery lives so
      // sticky notes never spawn underneath or overlapping it
      const isInExclusionZone = (x: number, y: number) => x < 24 && y < 32;

      let bestX = 30;
      let bestY = 10;
      let maxDistance = -1;
      let foundValidCandidate = false;

      for (let attempt = 0; attempt < 50; attempt++) {
        const candidateX = Math.random() * 70 + 5;
        const candidateY = Math.random() * 55 + 5;

        // Skip any candidate that would land on/near the polaroid gallery
        if (isInExclusionZone(candidateX, candidateY)) continue;

        if (!foundValidCandidate) {
          bestX = candidateX;
          bestY = candidateY;
          foundValidCandidate = true;
          if (notes.length === 0) break;
          continue;
        }

        let minDistanceToOther = Infinity;
        for (const existingNote of notes) {
          const dx = candidateX - existingNote.x;
          const dy = candidateY - existingNote.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistanceToOther) {
            minDistanceToOther = dist;
          }
        }

        if (minDistanceToOther > maxDistance) {
          maxDistance = minDistanceToOther;
          bestX = candidateX;
          bestY = candidateY;
        }
      }

      const randomRotate = (Math.random() - 0.5) * 24;

      await push(notesRef, {
        ...data,
        x: bestX,
        y: bestY,
        rotate: randomRotate,
        createdAt: Date.now(),
      });
    },
    [notes],
  );

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.to?.toLowerCase().includes(query) ||
        note.from?.toLowerCase().includes(query) ||
        note.message?.toLowerCase().includes(query),
    );
  }, [notes, searchQuery]);

  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      style={{ background: "#f5ead6" }}
    >
      <WallScene />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* Header Bar */}
        <div
          className="w-full flex flex-wrap items-center justify-between gap-3 px-8 py-3"
          style={{ maxWidth: "1100px" }}
        >
          <div className="flex items-center gap-2.5">
            <Coffee size={18} style={{ color: "#6b4c2a" }} />
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(16px, 2vw, 21px)",
                color: "#3d1f0e",
              }}
            >
              PGC Visayas Interns Message Board
            </h1>

            <motion.button
              onClick={() => setShowIntro(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="About this board"
              className="p-1 rounded-full flex items-center justify-center text-[#6b4c2a]/60 hover:text-[#6b4c2a] transition-colors ml-1 cursor-pointer"
            >
              <HelpCircle size={17} />
            </motion.button>
          </div>

          <div className="flex items-center gap-3 flex-1 sm:flex-none justify-end">
            <div
              className="relative flex items-center rounded-full px-3 py-1.5"
              style={{
                background: "rgba(253, 248, 239, 0.75)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(107, 76, 42, 0.2)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Search size={14} className="text-[#6b4c2a]/60 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs outline-none w-28 sm:w-40 text-[#3d1f0e] placeholder-[#6b4c2a]/50"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-0.5 rounded-full hover:bg-black/5 text-[#6b4c2a]/60 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <motion.button
              onClick={() => setShowAdd(true)}
              whileHover={{
                y: -1,
                boxShadow: "0 6px 20px rgba(107,76,42,0.35)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold shrink-0 cursor-pointer"
              style={{
                background: "#6b4c2a",
                color: "#fdf8ef",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13px",
                boxShadow: "0 3px 12px rgba(107,76,42,0.3)",
              }}
            >
              <Plus size={15} /> Add a note
            </motion.button>
          </div>
        </div>

        {/* Corkboard Container */}
        <div
          className="flex-1 w-full relative"
          style={{ maxWidth: "1100px", padding: "0 24px 28px" }}
        >
          <div
            className="w-full h-full overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #b8762e 0%, #8f5a1e 40%, #6e4116 65%, #8f5a1e 85%, #b07228 100%)",
              padding: "18px",
              boxShadow:
                "0 12px 48px rgba(40,20,5,0.45), 0 3px 10px rgba(40,20,5,0.25), inset 0 1px 2px rgba(255,220,140,0.2)",
              borderRadius: "16px",
            }}
          >
            <div
              className="relative w-full rounded-xl overflow-visible"
              style={{
                height: "calc(100vh - 152px)",
                minHeight: "380px",
                backgroundColor: "#b8813a",
                backgroundImage: `
                  radial-gradient(circle, rgba(61, 31, 14, 0.22) 1.2px, transparent 1.2px),
                  radial-gradient(ellipse at 25% 35%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)
                `,
                backgroundSize: "16px 16px, 100% 100%",
                boxShadow: "inset 0 2px 16px rgba(61,31,14,0.35)",
              }}
            >
              <div
                className="absolute inset-3 rounded-lg pointer-events-none z-0"
                style={{
                  border: "1px dashed rgba(61, 31, 14, 0.28)",
                }}
              />

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-lg flex justify-between items-start pointer-events-none z-10">
                <svg
                  className="absolute top-0 left-0 w-full h-10 overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 20"
                >
                  <path
                    d="M 0 2 Q 50 18 100 2"
                    fill="none"
                    stroke="rgba(61,31,14,0.3)"
                    strokeWidth="0.8"
                    strokeDasharray="1.5 1.5"
                  />
                </svg>

                {GARLAND_FLAGS.map((flag, idx) => (
                  <div
                    key={flag.id}
                    className="relative z-10"
                    style={{
                      marginTop: `${Math.sin((idx / 4) * Math.PI) * 12}px`,
                      transform: `rotate(${flag.rotate}deg)`,
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "28px",
                        backgroundColor: flag.color,
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                  </div>
                ))}
              </div>

              {WASHI_TAPES.map((tape) => (
                <div
                  key={tape.id}
                  className="absolute pointer-events-none z-0"
                  style={{
                    left: `${tape.x}%`,
                    top: `${tape.y}%`,
                    width: `${tape.width}px`,
                    height: "18px",
                    backgroundColor: tape.color,
                    transform: `rotate(${tape.rotate}deg)`,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    backdropFilter: "blur(1px)",
                    borderLeft: "2px dashed rgba(255,255,255,0.4)",
                    borderRight: "2px dashed rgba(255,255,255,0.4)",
                  }}
                />
              ))}

              {/* Render Polaroid Gallery */}
              <PolaroidGallery
                onPhotoClick={(photo) => setSelectedPhoto(photo)}
              />

              {STICKERS.map((sticker) => (
                <div
                  key={sticker.id}
                  className="absolute select-none z-0 pointer-events-none"
                  style={{
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    fontSize: "26px",
                    transform: `rotate(${sticker.rotate}deg) scale(${sticker.scale})`,
                    filter: `
                      drop-shadow(2px 0 0 #fff) 
                      drop-shadow(-2px 0 0 #fff) 
                      drop-shadow(0 2px 0 #fff) 
                      drop-shadow(0 -2px 0 #fff) 
                      drop-shadow(1px 1px 0 #fff) 
                      drop-shadow(-1px -1px 0 #fff) 
                      drop-shadow(0 3px 6px rgba(61,31,14,0.25))
                    `,
                  }}
                >
                  {sticker.emoji}
                </div>
              ))}

              <AnimatePresence>
                {filteredNotes.map((note) => (
                  <StickyNote
                    key={note.id}
                    note={note}
                    onClick={() => setSelectedNote(note)}
                  />
                ))}
              </AnimatePresence>

              {filteredNotes.length === 0 && notes.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <p
                    className="text-sm font-medium opacity-60"
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      color: "#3d1f0e",
                    }}
                  >
                    No notes matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}

              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-center pointer-events-none z-20"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: "rgba(253,246,227,0.55)",
                  letterSpacing: "0.08em",
                }}
              >
                hover to peek · click to read
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spotify iFrame Floating Container */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2">
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden rounded-2xl shadow-2xl border border-[#6b4c2a]/20 bg-[#fdf8ef] ${
            showMusic
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto max-h-[152px]"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none max-h-0"
          }`}
          style={{ width: "300px" }}
        >
          <div ref={spotifyEmbedContainerRef} className="w-full h-[152px]" />
        </div>

        {/* Now Playing Control Button */}
        <motion.button
          onClick={() => setShowMusic(!showMusic)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full font-semibold text-xs relative z-10 cursor-pointer"
          style={{
            background: "#6b4c2a",
            color: "#fdf8ef",
            fontFamily: "'Nunito', sans-serif",
            boxShadow: "0 4px 14px rgba(61,31,14,0.3)",
          }}
        >
          {showMusic ? (
            <X size={14} className="shrink-0" />
          ) : (
            <Music size={14} className="shrink-0" />
          )}
          <span>Now Playing</span>
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showIntro && <IntroModal onClose={handleCloseIntro} />}
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
        {showAdd && (
          <AddNoteModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
        )}
      </AnimatePresence>

      {/* Polaroid Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <DetailPhotoModal
            selectedPhoto={selectedPhoto}
            photos={photos}
            selectedIndex={selectedIndex}
            onClose={() => setSelectedPhoto(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
