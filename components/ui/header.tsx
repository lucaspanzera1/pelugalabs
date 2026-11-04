"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./logo";
import MobileMenu from "./mobile-menu";

const navLinks = [
  { name: "Sobre", href: "/#services" },
  { name: "Soluções", href: "/#features" },
  { name: "Blog", href: "/#blog" },
  { name: "FAQ", href: "/#faq" },
];

export default function Header() {
  const [top, setTop] = useState<boolean>(true);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      setTop(window.scrollY <= 10);
    };
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  // Close mobile menu on hash change (when clicking sections)
  useEffect(() => {
    const handleHashChange = () => setMobileMenuOpen(false);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 w-full z-40 transition-all duration-500 ease-in-out ${top ? "mt-6" : "mt-2"
        }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`relative flex items-center justify-between gap-3 rounded-2xl px-4 py-2 transition-all duration-500 ${top
            ? "bg-[#172E6E]/70 backdrop-blur-md border border-white/20"
            : "bg-[#172E6E]/90 backdrop-blur-xl shadow-lg shadow-slate-900/5 border border-white/20"
            }`}
        >
          {/* Subtle tint background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_50%)]" />

          {/* Site branding */}
          <div className="flex flex-1 items-center relative z-10">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Logo />
            </motion.div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex flex-1 justify-center relative z-10">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.name} className="relative px-1">
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`block px-4 py-2 text-sm font-medium transition-colors duration-300 relative z-10 ${hoveredLink === link.name ? "text-white" : "text-white/85"
                      }`}
                  >
                    {link.name}
                    <AnimatePresence>
                      {hoveredLink === link.name && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop action buttons */}
          <ul className="flex flex-1 items-center justify-end gap-3 relative z-10">
            <li className="hidden sm:inline-flex">
              <Link
                href="/budget"
                target="_blank"
                className="group relative px-5 py-2 text-sm font-medium bg-white/10 text-white/95 rounded-xl overflow-hidden transition-all hover:text-white border border-white/20 hover:border-white/30 active:scale-95"
              >
                <span className="relative z-10">Orçamento</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </Link>
            </li>

            <li className="hidden sm:inline-flex">
              <Link
                href="https://api.whatsapp.com/send/?phone=5531991826043"
                target="_blank"
                className="group relative bg-white px-6 py-2 text-sm font-medium text-[#172E6E] rounded-xl shadow-[0_4px_14px_rgba(15,23,42,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>WhatsApp</span>
                  <motion.span
                    animate={{ x: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </li>

            <li className="md:hidden">
              <MobileMenu isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
            </li>
          </ul>
        </div>
      </div>
    </motion.header>
  );
}
