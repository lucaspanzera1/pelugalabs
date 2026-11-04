"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import BudgetForm from "@/app/(plus)/budget/BudgetForm";
import { useEffect } from "react";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BudgetModal({ isOpen, onClose }: BudgetModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xl"
          />
          
          {/* Modal Content Container */}
          <div className="relative z-10 w-full max-w-2xl max-h-[95vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 400
              }}
              className="relative w-full bg-[#172E6E] border border-white/20 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 z-20 p-2.5 rounded-full bg-[#172E6E] hover:bg-white/10 transition-all text-white/60 hover:text-white"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>

              {/* Form Wrapper */}
              <div className="overflow-y-auto max-h-[90vh] p-10 md:p-14 custom-scrollbar">
                <BudgetForm isModal={true} />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
