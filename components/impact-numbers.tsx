"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const stats: StatItem[] = [
  { value: 500, suffix: "+", label: "Dispositivos Gerenciados" },
  { value: 99, suffix: ",9%", label: "Disponibilidade de Infraestrutura" },
  { value: 24, suffix: "/7", label: "Monitoramento Ativo" },
  { value: 1, suffix: "h", prefix: "< ", label: "Tempo Médio de Resposta" },
];

function useCountUp(target: number, duration: number = 1800, started: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) {
      setCount(0);
      return;
    }
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);

  return count;
}

function StatCard({ stat, index, started }: { stat: StatItem; index: number; started: boolean }) {
  const count = useCountUp(stat.value, 1600 + index * 200, started);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative group flex flex-col items-center justify-center rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105"
    >
      {/* Glassmorphism card */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/6 via-[#172E6E]/40 to-white/6 backdrop-blur-sm border border-white/20 group-hover:border-white/12 transition-colors" />
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

      <div className="relative z-10">
        <div className="mb-2 font-nacelle text-5xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/70 to-white">
            {stat.prefix ?? ""}
            {count}
            {stat.suffix}
          </span>
        </div>
        <p className="text-sm font-medium text-white/60 uppercase tracking-widest">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

export default function ImpactNumbers() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(isInView);
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Divider line */}
        <div className="border-t [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/25%),transparent)1] mb-12" />

        {/* Label */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-white/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-white/50">
            <span className="text-white text-sm font-semibold">
              Resultados que sustentam operações críticas
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} started={started} />
          ))}
        </div>

        {/* Client logos strip */}
        <div className="mt-14 text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-white/60">
            Empresas que confiam sua operação à Peluga Labs
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {/* TODO: substituir por clientes reais de infraestrutura/TI corporativa */}
            {[
              "NovoDeNovo",
              "Ribeiro Representações",
              "Projeto Aluga Kids",
            ].map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-white/60 hover:text-white/75 transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
