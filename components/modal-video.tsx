"use client";

import { useState, useRef } from "react";
import type { StaticImageData } from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

interface ModalVideoProps {
  thumb: StaticImageData;
  thumbWidth: number;
  thumbHeight: number;
  thumbAlt: string;
  video: string;
  videoWidth: number;
  videoHeight: number;
}

export default function ModalVideo({
  thumb,
  thumbWidth,
  thumbHeight,
  thumbAlt,
  video,
  videoWidth,
  videoHeight,
}: ModalVideoProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative group/video rounded-3xl p-2 bg-gradient-to-b from-white/10 to-transparent border border-slate-200 shadow-2xl">
      {/* Decorative Glow */}
      <div className="absolute -inset-2 bg-slate-600/20 blur-3xl opacity-0 group-hover/video:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Video thumbnail */}
      <button
        className="relative block w-full rounded-[20px] overflow-hidden group focus:outline-hidden"
        onClick={() => setModalOpen(true)}
        aria-label="Assistir demonstração"
      >
        <Image
          className="w-full h-auto transition-transform duration-700 scale-[1.01] group-hover:scale-105 opacity-80"
          src={thumb}
          width={thumbWidth}
          height={thumbHeight}
          priority
          alt={thumbAlt}
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/20 group-hover:bg-white/40 transition-colors duration-500">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-4 px-6 py-3 bg-slate-100 backdrop-blur-md border border-slate-300 rounded-2xl shadow-2xl group/btn"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-slate-800 rounded-full shadow-lg shadow-slate-600/40 group-hover/btn:bg-slate-600 transition-colors">
              <Play className="w-5 h-5 fill-white text-slate-900 ml-1" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-slate-900 uppercase tracking-wider">Assistir Demo</span>
              <span className="block text-xs text-slate-500/60 font-medium">Tecnologia em Ação</span>
            </div>
          </motion.div>
        </div>

        {/* Shine reflect effect */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
      </button>

      <Dialog
        initialFocus={videoRef}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-[101] flex px-4 py-6 sm:px-6 items-center justify-center">
          <DialogPanel
            transition
            className="aspect-video max-h-full w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
          >
            <video
              ref={videoRef}
              width={videoWidth}
              height={videoHeight}
              loop
              controls
              autoPlay
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
