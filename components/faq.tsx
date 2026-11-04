"use client";

import { useState, useRef, useCallback } from "react";
import { faqs, type FAQItem } from "@/content/faq";

type Category = FAQItem["category"] | "todos";

const categoryConfig: Record<Category, { label: string; color: string; ring: string; dot: string }> = {
  todos:    { label: "Todos",    color: "text-white/85",   ring: "ring-white/20",        dot: "bg-white/40" },
  processo: { label: "Processo", color: "text-blue-300",   ring: "ring-blue-500/20",     dot: "bg-blue-400" },
  negocio:  { label: "Negócio",  color: "text-indigo-300", ring: "ring-indigo-500/20",   dot: "bg-indigo-400" },
  tecnico:  { label: "Técnico",  color: "text-purple-300", ring: "ring-purple-500/20",   dot: "bg-purple-400" },
};

// ─── Accordion ──────────────────────────────────────────────────────────────
function FAQAccordion({
  item,
  globalIndex,
  displayIndex,
  isOpen,
  onToggle,
  animDelay,
  entering,
}: {
  item: FAQItem;
  globalIndex: number;
  displayIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  animDelay: number;
  entering: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const cfg = categoryConfig[item.category];

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-white/18 bg-gradient-to-br from-white/4 via-[#172E6E]/60 to-[#172E6E]/40"
          : "border-white/20 bg-[#172E6E]/30 hover:border-white/30 hover:bg-[#172E6E]"
      } ${entering ? "animate-[faqIn_0.35s_ease-out_both]" : ""}`}
      style={{ animationDelay: entering ? `${animDelay}ms` : undefined }}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-[2px] rounded-full transition-all duration-300 ${
          isOpen ? "bg-gradient-to-b from-white/50 to-white/50 opacity-100" : "opacity-0"
        }`}
      />

      <button
        className="flex w-full items-start justify-between gap-4 px-4 py-5 sm:px-6 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3 min-w-0">
          {/* Number */}
          <span
            className={`mt-0.5 shrink-0 text-xs font-bold tabular-nums transition-colors duration-300 ${
              isOpen ? "text-white/75" : "text-white/60"
            }`}
          >
            {String(displayIndex + 1).padStart(2, "0")}
          </span>

          <span
              className={`font-medium leading-snug transition-colors duration-300 ${
                isOpen ? "text-white" : "text-white/85 group-hover:text-white"
              }`}
            >
              {item.question}
            </span>
        </div>

        {/* Toggle icon */}
        <div
          className={`mt-0.5 shrink-0 flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "border-white/30 bg-white/12 text-white/75 rotate-45"
              : "border-white/20 bg-[#172E6E] text-white/60 group-hover:border-white/30 group-hover:text-white/85"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </button>

      {/* Answer */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-350 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight ?? 600}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-6 pb-5 pl-10 sm:pl-[3.25rem]">
          <p className="text-sm leading-relaxed text-white/60">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<Category>("todos");
  const [openKey, setOpenKey] = useState<string | null>("todos-0");
  const [entering, setEntering] = useState(false);
  const [displayedCategory, setDisplayedCategory] = useState<Category>("todos");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevCategoryRef = useRef<Category>("todos");
  const listRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = ["todos", "processo", "negocio", "tecnico"];

  const getFiltered = useCallback(
    (cat: Category) => (cat === "todos" ? faqs : faqs.filter((f) => f.category === cat)),
    []
  );

  const countFor = (cat: Category) =>
    cat === "todos" ? faqs.length : faqs.filter((f) => f.category === cat).length;

  const filtered = getFiltered(displayedCategory);

  const handleCategoryChange = (cat: Category) => {
    if (cat === activeCategory || isTransitioning) return;
    prevCategoryRef.current = activeCategory;
    setActiveCategory(cat);
    setIsTransitioning(true);

    // 1. Fade out current list
    if (listRef.current) {
      listRef.current.style.opacity = "0";
      listRef.current.style.transform = "translateY(6px)";
    }

    setTimeout(() => {
      // 2. Switch data & reset open state
      setDisplayedCategory(cat);
      setOpenKey(`${cat}-0`); // auto-open first item

      // 3. Trigger enter animation
      setEntering(true);
      if (listRef.current) {
        listRef.current.style.opacity = "";
        listRef.current.style.transform = "";
      }

      setTimeout(() => {
        setEntering(false);
        setIsTransitioning(false);
      }, 400);
    }, 200);
  };

  const toggleItem = (key: string) => {
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <section id="faq" className="relative overflow-hidden">
      {/* Keyframe injected via style tag */}
      <style>{`
        @keyframes faqIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/25%),transparent)1] md:py-20">

          {/* Header */}
          <div className="mx-auto max-w-3xl pb-10 text-center">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-white/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-white/50">
              <span className="text-white text-sm font-semibold">
                Tire suas dúvidas
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-white),#c7d2fe,var(--color-white),#c7d2fe,var(--color-white))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-white/60">
              Respostas diretas sobre desenvolvimento, prazos, custos e suporte.
            </p>
          </div>

          {/* ── Filter Bar ─────────────────────────────────────────────── */}
          <div className="mb-10 flex flex-col items-center gap-4">
            <div className="no-scrollbar relative flex max-w-full overflow-x-auto rounded-[1.25rem] bg-white/4 p-1 gap-1">
              {categories.map((cat) => {
                const cfg = categoryConfig[cat];
                const isActive = activeCategory === cat;
                const count = countFor(cat);

                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    disabled={isTransitioning}
                    className={`
                      relative flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium
                      transition-all duration-250 disabled:cursor-default
                      ${isActive
                        ? `bg-gradient-to-b from-[#172E6E] via-white/6 to-[#172E6E] text-white shadow-sm ring-1 ${cfg.ring}`
                        : "text-white/75 hover:text-white"
                      }
                    `}
                  >
                    {/* Active dot */}
                    {isActive && (
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    )}
                    <span>{cfg.label}</span>

                    {/* Count badge */}
                    <span
                      className={`
                        flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums
                        transition-all duration-200
                        ${isActive
                          ? `${cfg.color} bg-white/10`
                          : "text-white/60 bg-[#172E6E] group-hover:text-white/75"
                        }
                      `}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Result context line */}
            <p
              className={`text-xs text-white/60 transition-opacity duration-200 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {displayedCategory === "todos"
                ? `Exibindo todas as ${filtered.length} perguntas`
                : `${filtered.length} pergunta${filtered.length > 1 ? "s" : ""} em "${categoryConfig[displayedCategory].label}"`}
            </p>
          </div>

          {/* ── FAQ List ───────────────────────────────────────────────── */}
          <div className="mx-auto max-w-4xl">
            <div
              ref={listRef}
              className="grid gap-3 transition-all duration-200 ease-out"
            >
              {filtered.map((item, i) => {
                const itemKey = `${displayedCategory}-${i}`;
                return (
                  <FAQAccordion
                    key={itemKey}
                    item={item}
                    globalIndex={faqs.indexOf(item)}
                    displayIndex={i}
                    isOpen={openKey === itemKey}
                    onToggle={() => toggleItem(itemKey)}
                    animDelay={i * 50}
                    entering={entering}
                  />
                );
              })}
            </div>
          </div>

          {/* ── Bottom CTA ─────────────────────────────────────────────── */}
          <div className="mt-14 text-center">
            <div className="relative inline-block rounded-2xl bg-gradient-to-br from-[#172E6E]/80 via-white/4 to-[#172E6E]/80 border border-white/20 px-8 py-6 backdrop-blur-sm">
              <p className="mb-4 text-white/85">
                Não encontrou o que precisava?{" "}
                <span className="text-white font-medium">Fale diretamente com a gente.</span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://api.whatsapp.com/send/?phone=5531991826043"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] hover:scale-[1.02]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chamar no WhatsApp
                </a>
                <a
                  href="/budget"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-[#172E6E] px-5 py-2.5 text-sm font-semibold text-white/85 transition-all hover:border-white/30 hover:text-white hover:bg-white/10"
                >
                  Diagnóstico Gratuito
                  <span className="text-white/60">→</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
