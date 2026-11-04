"use client";

import { Solucao, solucoes } from "@/content/solucoes";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import BudgetModal from "@/components/budget-modal";
import WhatsAppButton from "@/components/whatsapp-button";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=5531991826043";

export default function SolutionContent({ solucao }: { solucao: Solucao }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { details } = solucao;

  const PrimaryCta = ({ label = "Fale com um especialista" }: { label?: string }) => (
    <button
      onClick={() => setIsModalOpen(true)}
      className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#172E6E] transition-colors hover:bg-slate-100"
    >
      {label}
      <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-white">
        {/* Hero */}
        <section className="pt-36 pb-20 md:pt-44 md:pb-28 border-b border-white/20">
          <p className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
            {solucao.title}
          </p>
          <h1 className="font-nacelle text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] max-w-4xl">
            {details.heroTitle}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl">
            {details.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <PrimaryCta label="Solicitar diagnóstico gratuito" />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/95 underline-offset-4 hover:text-white hover:underline"
            >
              ou chame no WhatsApp
            </a>
          </div>
        </section>

        {/* Contexto */}
        <section className="py-20 md:py-24 grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16 border-b border-white/20">
          <h2 className="font-nacelle text-2xl md:text-3xl font-bold tracking-tight">
            Por que isso importa
          </h2>
          <p className="text-lg text-white/85 leading-relaxed">{solucao.description}</p>
        </section>

        {/* O que fazemos */}
        <section className="py-20 md:py-24 border-b border-white/20">
          <h2 className="font-nacelle text-2xl md:text-3xl font-bold tracking-tight mb-12">
            O que fazemos
          </h2>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
            {details.features.map((feature) => (
              <div key={feature.title} className="border-t-2 border-white pt-5">
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/85 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Resultados */}
        <section className="py-20 md:py-24 grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16 border-b border-white/20">
          <h2 className="font-nacelle text-2xl md:text-3xl font-bold tracking-tight">
            O que sua empresa ganha
          </h2>
          <ul className="space-y-4">
            {details.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-lg text-white/95">
                <Check size={22} className="mt-1 shrink-0 text-white" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ (espelha o FAQPage JSON-LD) */}
        <section className="py-20 md:py-24 grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16 border-b border-white/20">
          <h2 className="font-nacelle text-2xl md:text-3xl font-bold tracking-tight">
            Perguntas frequentes
          </h2>
          <div className="divide-y divide-white/20 border-y border-white/20">
            {solucao.faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-white">
                  <h3 className="text-base">{faq.question}</h3>
                  <span className="text-xl leading-none text-white/60 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-white/85">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="py-24 md:py-32 text-center">
          <h2 className="font-nacelle text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Fale sobre o seu projeto com quem desenvolve software todos os dias.
          </h2>
          <div className="mt-10 flex justify-center">
            <PrimaryCta />
          </div>
        </section>

        {/* Outras soluções (links internos) */}
        <nav aria-label="Outras soluções" className="pb-24 border-t border-white/20 pt-10">
          <p className="mb-4 text-sm font-semibold text-white/75">Outras soluções</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {solucoes
              .filter((s) => s.slug !== solucao.slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/solucoes/${s.slug}`}
                  className="text-white/95 underline-offset-4 hover:text-white hover:underline"
                >
                  {s.title}
                </Link>
              ))}
          </div>
        </nav>
      </div>

      <WhatsAppButton />
      <BudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
