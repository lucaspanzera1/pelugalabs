"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const words = [
  "sua operação",
  "eliminar planilhas",
  "automatizar tarefas",
  "crescer sem travar"
];

export default function HeroHome() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const typingSpeed = isDeleting ? 40 : 80;
    const pauseTime = 1800;

    if (!isDeleting && displayText === currentWord) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentWord.slice(0, prev.length - 1)
          : currentWord.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-start pt-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full mx-auto max-w-6xl pl-8 pr-4 sm:pl-10 sm:pr-6">
        <div className="relative">
          <motion.div
            className="text-left pb-16 md:pb-24"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >

            <motion.h1
              variants={fadeInUp}
              className="font-nacelle text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]"
            >
              <span className="sr-only">Software sob medida para a sua operação: elimine planilhas, automatize tarefas e cresça sem travar</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70" aria-hidden="true">
                <span className="md:hidden">Software feito para</span>
                <span className="hidden md:inline">Software sob medida para</span>
              </span>
              <br />
              <div className="h-[1.2em] relative flex justify-start items-center w-full">
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#dbe2ff] to-white animate-gradient bg-[length:200%_auto] whitespace-nowrap"
                  aria-hidden="true"
                >
                  {displayText}
                  <span className="inline-block w-[3px] md:w-[4px] h-[0.85em] bg-white ml-1 -mb-[0.05em] animate-blink align-middle" />
                </span>
              </div>
            </motion.h1>


            <motion.div variants={fadeInUp} className="max-w-2xl">
              <p className="hidden md:block text-lg md:text-xl text-white/75 mb-10 leading-relaxed">
                Troque planilhas e retrabalho por sistemas, sites e integrações feitos para a sua empresa.
                Primeira versão em semanas, não meses.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 mt-8 md:mt-0">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <a
                    className="group relative flex items-center justify-center px-8 py-4 bg-white text-[#172E6E] font-semibold rounded-xl shadow-[0_4px_20px_rgba(87,105,229,0.2)] hover:shadow-[0_6px_28px_rgba(87,105,229,0.3)] transition-all overflow-hidden w-full sm:w-auto min-w-[200px]"
                    href="https://api.whatsapp.com/send/?phone=5531991826043"
                    target="_blank"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Falar com um Especialista
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.span>
                    </span>
                    <div className="absolute inset-0 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <a
                    className="group flex items-center justify-center px-8 py-4 bg-[#172E6E] text-white/95 font-semibold rounded-xl border border-white/20 hover:border-white/30 hover:text-white transition-all w-full sm:w-auto min-w-[200px] shadow-sm"
                    href="#features"
                  >
                    Ver Soluções
                  </a>
                </motion.div>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
                {["Código é seu", "Entregas a cada 2 semanas", "Diagnóstico gratuito"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/blog/2026-11-02-quanto-custa-desenvolver-um-sistema"
                className="mt-4 inline-flex items-center gap-1 text-sm text-white/75 underline-offset-4 hover:text-white hover:underline"
              >
                Quanto custa um sistema? Veja o que define o preço
                <span aria-hidden="true">→</span>
              </a>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
