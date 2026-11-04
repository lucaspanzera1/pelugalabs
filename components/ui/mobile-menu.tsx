"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const menuLinks = [
  { name: "Sobre", href: "/#services" },
  { name: "Soluções", href: "/#features" },
  { name: "Blog", href: "/#blog" },
  { name: "FAQ", href: "/#faq" },
  { name: "Orçamento", href: "/budget" },
];

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!menuRef.current || !triggerRef.current) return;
      if (!isOpen || menuRef.current.contains(target as Node) || triggerRef.current.contains(target as Node)) return;
      setIsOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [isOpen, setIsOpen]);

  // Close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!isOpen || keyCode !== 27) return;
      setIsOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [isOpen, setIsOpen]);

  return (
    <div className="md:hidden flex items-center relative z-50">
      {/* Hamburger button */}
      <button
        ref={triggerRef}
        className="relative w-10 h-10 flex flex-col justify-center items-center group focus:outline-none rounded-xl hover:bg-white/10 transition-colors"
        aria-controls="mobile-nav"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="w-6 flex flex-col items-end gap-1.5">
          <span
            className={`block h-0.5 bg-white transition-all duration-300 ease-out origin-right ${
              isOpen ? "w-6 -rotate-45 -translate-y-[1px]" : "w-6"
            }`}
          />
          <span
            className={`block h-0.5 bg-white transition-all duration-300 ease-out ${
              isOpen ? "w-0 opacity-0" : "w-4 group-hover:w-6"
            }`}
          />
          <span
            className={`block h-0.5 bg-white transition-all duration-300 ease-out origin-right ${
              isOpen ? "w-6 rotate-45 translate-y-[1px]" : "w-6"
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-white/30 backdrop-blur-sm"
            />

            {/* Menu Drawer */}
            <motion.nav
              ref={menuRef}
              id="mobile-nav"
              className="fixed top-0 right-0 z-40 w-full max-w-xs h-screen bg-[#172E6E] border-l border-white/20 shadow-2xl p-6 pt-24"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <ul className="flex flex-col gap-2">
                {menuLinks.map((link, idx) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block py-3 text-lg font-medium text-white/95 hover:text-white hover:translate-x-1 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
                
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6"
                >
                  <Link
                    href="https://api.whatsapp.com/send/?phone=5531991826043"
                    target="_blank"
                    className="flex items-center justify-center w-full py-3 bg-white text-[#172E6E] font-medium rounded-xl shadow-lg shadow-white/20 hover:bg-slate-100 active:scale-95 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    WhatsApp
                  </Link>
                </motion.li>
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
