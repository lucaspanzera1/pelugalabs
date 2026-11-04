"use client";

import Image from "next/image";
import BlurredShape from "@/public/images/blurred-shape.svg";
import { useState } from "react";
import BudgetModal from "./budget-modal";

export default function Cta() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt=""
        />
      </div>
      <div className="max-w6xl mx-auto px-4 sm:px-6">
        <div className="bg-linear-to-r from-transparent via-white/5 py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-white),#c7d2fe,var(--color-white),#c7d2fe,var(--color-white))] bg-[length:200%_auto] bg-clip-text pb-8 font-nacelle text-3xl font-semibold text-transparent md:text-4xl"
              data-aos="fade-up"
            >
              Seu negócio merece mais que planilha.
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-white/60" data-aos="fade-up" data-aos-delay={200}>
              Diagnóstico gratuito: entendemos o seu desafio e você sai com escopo, etapas e estimativa de prazo e investimento, sem compromisso.
            </p>
            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <div data-aos="fade-up" data-aos-delay={400}>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn group mb-4 w-full bg-white hover:bg-slate-100 text-[#172E6E] font-medium rounded-xl shadow-lg transition-all duration-300 sm:mb-0 sm:w-auto cursor-pointer"
                >
                  <span className="relative inline-flex items-center">
                    Agendar Diagnóstico Gratuito
                    <span className="ml-1.5 tracking-normal text-[#172E6E]/70 transition-transform group-hover:translate-x-1">
                      -&gt;
                    </span>
                  </span>
                </button>
              </div>
              <div data-aos="fade-up" data-aos-delay={600}>
                <a
                  className="btn relative w-full bg-linear-to-b from-white/10 to-white/6 bg-[length:100%_100%] bg-[bottom] text-white/85 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,--theme(--color-white/.2),--theme(--color-white/.45),--theme(--color-white/.2))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%] sm:ml-4 sm:w-auto"
                  href="https://api.whatsapp.com/send/?phone=5531991826043&text=Ol%C3%A1%21+Quero+conversar+sobre+um+projeto+de+software."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Agendar pelo WhatsApp
                </a>
              </div>
            </div>
            <p className="mt-6 text-sm text-white/75" data-aos="fade-up" data-aos-delay={700}>
              Antes de conversar, quer ter uma ideia de investimento?{" "}
              <a href="/blog/2026-11-02-quanto-custa-desenvolver-um-sistema" className="font-medium text-white underline underline-offset-4 hover:text-white/85">
                Veja o que define o preço de um sistema
              </a>
            </p>
          </div>
        </div>
      </div>

      <BudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
