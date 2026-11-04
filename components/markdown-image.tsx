'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function MarkdownImage({ src, alt, ...props }: any) {
  const [isOpen, setIsOpen] = useState(false);

  // Bloquear scroll quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fechar com Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const fullSrc = src?.startsWith('http') || src?.startsWith('/') ? src : `/${src}`;

  return (
    <>
      <span className="relative group flex justify-center w-full">
        <img
          {...props}
          src={fullSrc}
          alt={alt}
          onClick={() => setIsOpen(true)}
          className="mx-auto rounded-3xl shadow-2xl max-w-full h-auto border border-white/5 hover:border-teal-400/30 transition-all duration-500 my-12 cursor-zoom-in"
        />
        
        {/* Hover Hint */}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 z-10">
          <span className="bg-black/40 backdrop-blur-md rounded-full p-3 border border-white/10 text-white/80">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zoom-in">
              <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/>
            </svg>
          </span>
        </span>
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/95 backdrop-blur-xl p-4 md:p-8 overflow-hidden"
          >
            {/* Backdrop handle close */}
            <span 
              className="absolute inset-0 cursor-zoom-out" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.span
              layoutId="expanded-image"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-h-full max-w-5xl w-full flex items-center justify-center pointer-events-none"
            >
              <img
                src={fullSrc}
                alt={alt}
                className="max-h-[90vh] max-w-full rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto"
              />
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute -top-12 right-0 md:-right-12 p-2 text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-white/10 backdrop-blur-md pointer-events-auto"
              >
                <X size={24} />
              </button>
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
}
