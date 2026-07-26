import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { onValue, push } from "firebase/database";
import { photosRef } from "../firebase";
import React from "react";
import type { PolaroidPhoto } from "../App";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date?: string;
  rotate?: number;
}

const BLANK_PHOTO_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect width='500' height='500' fill='%23f3ead9'/%3E%3Crect x='20' y='20' width='460' height='460' fill='none' stroke='%23c9b896' stroke-width='4' stroke-dasharray='12 10'/%3E%3Cg transform='translate(250,230)' fill='%23c9b896'%3E%3Crect x='-70' y='-40' width='140' height='100' rx='10'/%3E%3Ccircle cx='0' cy='10' r='32' fill='%23f3ead9'/%3E%3Crect x='-20' y='-58' width='40' height='22' rx='6'/%3E%3C/g%3E%3C/svg%3E";

const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: "p1",
    url: BLANK_PHOTO_URL,
    caption: "",
  },
];

// Keep the polaroid photo window from ever getting too tall/skinny for
// very extreme aspect-ratio photos (panoramas, tall screenshots, etc.)
const MIN_ASPECT_RATIO = 0.65; // portrait cap
const MAX_ASPECT_RATIO = 1.6; // landscape cap

interface PolaroidGalleryProps {
  onPhotoClick?: (photo: PolaroidPhoto) => void;
}

export function PolaroidGallery({ onPhotoClick }: PolaroidGalleryProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(DEFAULT_PHOTOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [inputCaption, setInputCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Sync photos live from Firebase Realtime Database
  useEffect(() => {
    const unsubscribe = onValue(photosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const firebasePhotos: PhotoItem[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPhotos(firebasePhotos);
      } else {
        setPhotos(DEFAULT_PHOTOS);
      }
    });

    return () => unsubscribe();
  }, []);

  // Slideshow auto-advance every 4s
  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [photos.length]);

  // Upload file directly to Cloudinary via REST API
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !inputUrl.trim()) return;

    setIsUploading(true);
    try {
      let finalPhotoUrl = inputUrl.trim();

      if (selectedFile) {
        finalPhotoUrl = await uploadToCloudinary(selectedFile);
      }

      await push(photosRef, {
        url: finalPhotoUrl,
        caption: inputCaption.trim() || "Polaroid ✨",
        createdAt: Date.now(),
      });

      setSelectedFile(null);
      setInputUrl("");
      setInputCaption("");
      setShowAddModal(false);
      setCurrentIndex(photos.length);
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      alert(
        "Error uploading image. Please verify your Cloudinary Cloud Name and Upload Preset.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Record each photo's natural aspect ratio once it loads, clamped to a
  // sane range so the polaroid frame never gets absurdly tall or wide
  const handleImageLoad = (
    photoId: string,
    e: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const img = e.currentTarget;
    if (!img.naturalWidth || !img.naturalHeight) return;

    const rawRatio = img.naturalWidth / img.naturalHeight;
    const clampedRatio = Math.min(
      Math.max(rawRatio, MIN_ASPECT_RATIO),
      MAX_ASPECT_RATIO,
    );

    setAspectRatios((prev) =>
      prev[photoId] === clampedRatio
        ? prev
        : { ...prev, [photoId]: clampedRatio },
    );
  };

  const currentPhoto = photos[currentIndex] || photos[0];
  const currentAspectRatio = aspectRatios[currentPhoto.id] ?? 1;

  return (
    <>
      {/* Top Left Polaroid Component */}
      <div
        className="absolute top-5 left-5 z-20 p-2.5 pb-4 bg-white shadow-xl rounded-sm select-none group transition-transform duration-300 hover:rotate-0 hover:scale-105 cursor-pointer"
        style={{
          width: "140px",
          transform: "rotate(-6deg)",
          boxShadow: "0 8px 20px rgba(61,31,14,0.3)",
        }}
        onClick={() => onPhotoClick?.(currentPhoto)}
        title="Click to view full picture"
      >
        {/* Push Pin */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-30 shadow-md"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #ff6b6b 0%, #b81d1d 100%)",
          }}
        >
          <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>

        {/* Photo Canvas — sized to the photo's own aspect ratio */}
        <motion.div
          layout
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="relative w-full bg-neutral-100 overflow-hidden rounded-xs"
          style={{ aspectRatio: currentAspectRatio }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhoto.id}
              src={currentPhoto.url}
              alt={currentPhoto.caption}
              onLoad={(e) => handleImageLoad(currentPhoto.id, e)}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Nav Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(
                      (prev) => (prev - 1 + photos.length) % photos.length,
                    );
                  }}
                  className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors pointer-events-auto"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev + 1) % photos.length);
                  }}
                  className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors pointer-events-auto"
                >
                  <ChevronRight size={12} />
                </button>
              </>
            )}
          </div>

          {/* Add Photo Button Overlay */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddModal(true);
            }}
            title="Add a new photo"
            className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 pointer-events-auto"
          >
            <Plus size={12} />
          </button>
        </motion.div>

        {/* Caption */}
        <p
          className="text-[11px] text-center mt-2 text-[#3d1f0e] truncate font-medium"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "13px" }}
        >
          {currentPhoto.caption}
        </p>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#fdf8ef] p-6 rounded-2xl max-w-sm w-full border border-[#6b4c2a]/20 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                disabled={isUploading}
                className="absolute top-4 right-4 p-1 rounded-full text-[#6b4c2a]/60 hover:text-[#6b4c2a] transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={20} className="text-[#6b4c2a]" />
                <h3
                  className="text-lg font-bold text-[#3d1f0e]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Add a Polaroid Photo
                </h3>
              </div>

              <form onSubmit={handleAddPhoto} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6b4c2a] mb-1">
                    Upload Local Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSelectedFile(e.target.files[0]);
                        setInputUrl("");
                      }
                    }}
                    className="block w-full text-xs text-[#6b4c2a] file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#6b4c2a] file:text-[#fdf8ef] hover:file:bg-[#52391f] transition-colors"
                  />

                  <div className="mt-3 text-center text-xs text-[#6b4c2a]/60 font-medium">
                    — OR —
                  </div>

                  <label className="block text-xs font-semibold text-[#6b4c2a] mt-2 mb-1">
                    Paste Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      if (e.target.value) setSelectedFile(null);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#6b4c2a]/30 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#6b4c2a]/40 text-[#3d1f0e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6b4c2a] mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Sunset ✨"
                    maxLength={22}
                    value={inputCaption}
                    onChange={(e) => setInputCaption(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#6b4c2a]/30 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#6b4c2a]/40 text-[#3d1f0e]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={isUploading}
                    className="px-4 py-1.5 text-xs font-medium text-[#6b4c2a] hover:bg-black/5 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={(!selectedFile && !inputUrl) || isUploading}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#fdf8ef] bg-[#6b4c2a] rounded-full disabled:opacity-50 hover:bg-[#52391f] transition-colors"
                  >
                    {isUploading && (
                      <Loader2 size={12} className="animate-spin" />
                    )}
                    {isUploading ? "Uploading..." : "Add Photo"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
