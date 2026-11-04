"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Home, ChevronRight, Telescope } from "lucide-react";
import Footer from "@/components/ui/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#172E6E] selection:bg-white/20">
      <main className="relative flex min-h-screen items-center justify-center px-4 pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          {/* Animated Stars */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/30"
              initial={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random(),
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-white/6 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-white/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          {/* Animated 404 */}
          <div className="relative mb-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <span className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/15 sm:text-9xl">
                404
              </span>
              
              {/* Floating Rocket Icon */}
              <motion.div
                className="absolute -right-4 -top-4 text-white/75 sm:-right-8 sm:-top-8"
                animate={{
                  y: [0, -15, 0],
                  x: [0, 5, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Rocket size={48} className="rotate-45" />
              </motion.div>
            </motion.div>
          </div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Parece que você saiu da órbita.
            </h1>
            <p className="mb-8 text-lg text-white/60 leading-relaxed">
              A página que você está procurando não existe ou foi movida para outra galáxia. 
              Não se preocupe, ainda podemos te levar de volta para a Terra.
            </p>
          </motion.div>

          {/* Navigation Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-[#172E6E] transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
            >
              <Home size={18} />
              Voltar para o Início
            </Link>
            
            <Link
              href="https://api.whatsapp.com/send/?phone=5531991826043&text=Ol%C3%A1%2C+preciso+de+ajuda+com+o+site!"
              className="group flex items-center gap-2 rounded-full border border-white/20 bg-[#172E6E] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/30 active:scale-95"
            >
              <Telescope size={18} />
              Pedir Ajuda
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/12"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
            <div className="h-6 w-[1px] bg-white/12" />
          </div>
        </motion.div>
      </main>

      {/* Grid Pattern Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFFFFF 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />
      
      <Footer />
    </div>


  );
}
