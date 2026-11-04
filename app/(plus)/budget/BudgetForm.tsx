"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function BudgetPage({ isModal = false }: { isModal?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return numbers.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const data = {
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
        company: (form.elements.namedItem("company") as HTMLInputElement).value,
        projectType: (form.elements.namedItem("project-type") as HTMLSelectElement).value,
        budgetRange: (form.elements.namedItem("budget-range") as HTMLSelectElement).value,
        description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      };

      const res = await fetch("/api/send-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro ao enviar formulário");

      setIsModalOpen(true);
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao enviar o orçamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={isModal ? "" : "py-12 md:py-20"}>
      {/* Success Message */}
      {isModalOpen ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/6 mb-8">
            <svg className="h-10 w-10 text-white/85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">Tudo pronto!</h3>
          <p className="text-white/75 mb-10 max-w-sm mx-auto">
            Recebemos sua solicitação. Nossa equipe entrará em contato em até 24 horas úteis.
          </p>
          <button
            onClick={closeModal}
            className="bg-[#172E6E] hover:bg-white/10 text-white px-8 py-3 rounded-full transition-all border border-white/20"
          >
            Fechar
          </button>
        </motion.div>
      ) : (
        <>
          {/* Header */}
          <div className={`${isModal ? "mb-10" : "pb-12"} text-center`}>
            <h2 className={`${isModal ? "text-2xl" : "text-3xl md:text-4xl"} font-semibold text-white tracking-tight`}>
              Diagnóstico gratuito ou orçamento
            </h2>
            <p className={`${isModal ? "mt-3 text-sm" : "mt-4 text-lg"} text-white/75`}>
              Conte o que você precisa e retornamos com escopo e estimativa, sem compromisso. Projetos grandes ou pequenos.
            </p>
          </div>

          {/* Form */}
          <form className="mx-auto max-w-2xl" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {/* Essenciais */}
              <div>
                <label className="mb-2 block text-[10px] font-medium text-white/60 uppercase tracking-[0.2em]" htmlFor="name">
                  Nome
                </label>
                <input id="name" name="name" type="text" autoComplete="name" className="w-full bg-[#172E6E] border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/60" placeholder="Como te chamamos?" required />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-medium text-white/60 uppercase tracking-[0.2em]" htmlFor="phone">
                  WhatsApp
                </label>
                <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="w-full bg-[#172E6E] border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/60" placeholder="(31) 99999-9999" onChange={handlePhoneChange} minLength={14} maxLength={15} required />
              </div>

              {/* Full Width Row */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-[10px] font-medium text-white/60 uppercase tracking-[0.2em]" htmlFor="project-description">
                  O que você precisa?
                </label>
                <textarea
                  id="project-description"
                  name="description"
                  rows={4}
                  className="w-full bg-[#172E6E] border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:ring-0 transition-all resize-none placeholder:text-white/60"
                  placeholder="Ex.: controlamos pedidos em planilhas, 15 pessoas usam e queremos um sistema integrado ao nosso ERP."
                  required
                />
              </div>

              {/* Opcionais */}
              <details className="md:col-span-2 group/details">
                <summary className="cursor-pointer list-none text-sm text-white/75 hover:text-white select-none">
                  <span className="inline-block transition-transform group-open/details:rotate-90 mr-1">›</span>
                  Mais detalhes (opcional): e-mail, empresa, área e investimento
                </summary>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  <div>
                    <label className="mb-2 block text-[10px] font-medium text-white/60 uppercase tracking-[0.2em]" htmlFor="email">
                      E-mail
                    </label>
                    <input id="email" name="email" type="email" autoComplete="email" className="w-full bg-[#172E6E] border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/60" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] font-medium text-white/60 uppercase tracking-[0.2em]" htmlFor="company">
                      Empresa
                    </label>
                    <input id="company" name="company" type="text" autoComplete="organization" className="w-full bg-[#172E6E] border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/60" placeholder="Onde você trabalha?" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] font-medium text-white/60 uppercase tracking-[0.2em]" htmlFor="project-type">
                      Área de Interesse
                    </label>
                    <select id="project-type" name="project-type" className="w-full bg-[#172E6E] border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:ring-0 transition-all">
                      <option value="" className="bg-[#172E6E]">Selecione...</option>
                      <option value="diagnostico" className="bg-[#172E6E]">Diagnóstico gratuito</option>
                      <option value="sistemas" className="bg-[#172E6E]">Sistema Web Sob Medida</option>
                      <option value="mobile" className="bg-[#172E6E]">Aplicativo Mobile</option>
                      <option value="web" className="bg-[#172E6E]">Site ou Aplicação Web</option>
                      <option value="ecommerce" className="bg-[#172E6E]">E-commerce</option>
                      <option value="integracoes" className="bg-[#172E6E]">Integrações & APIs</option>
                      <option value="automacao" className="bg-[#172E6E]">Automação & Inteligência Artificial</option>
                      <option value="sustentacao" className="bg-[#172E6E]">Sustentação & Evolução de Software</option>
                      <option value="other" className="bg-[#172E6E]">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] font-medium text-white/60 uppercase tracking-[0.2em]" htmlFor="budget-range">
                      Investimento previsto
                    </label>
                    <select id="budget-range" name="budget-range" className="w-full bg-[#172E6E] border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:ring-0 transition-all">
                      <option value="" className="bg-[#172E6E]">Selecione...</option>
                      <option value="not-sure" className="bg-[#172E6E]">Ainda não sei</option>
                      <option value="ate-5k" className="bg-[#172E6E]">Até R$ 5 mil</option>
                      <option value="5k-10k" className="bg-[#172E6E]">R$ 5 mil - 10 mil</option>
                      <option value="10k-25k" className="bg-[#172E6E]">R$ 10 mil - 25 mil</option>
                      <option value="25k-50k" className="bg-[#172E6E]">R$ 25 mil - 50 mil</option>
                      <option value="50k+" className="bg-[#172E6E]">Acima de R$ 50 mil</option>
                    </select>
                  </div>
                </div>
              </details>
            </div>

            {/* Submit Button */}
            <div className="mt-10 flex flex-col items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-slate-100 text-[#172E6E] font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/10"
              >
                {isSubmitting ? "Enviando..." : "Quero meu diagnóstico gratuito"}
              </button>
              <p className="mt-4 text-[9px] text-white/60 uppercase tracking-[0.3em]">
                Respondemos pelo WhatsApp em até 1 dia útil
              </p>
            </div>
          </form>

          {/* Footer Link */}
          {!isModal && (
            <div className="mt-12 text-center text-sm text-white/60">
              Prefere conversar? <a href="https://api.whatsapp.com/send/?phone=5531991826043&text=Ol%C3%A1%21+Quero+conversar+sobre+um+projeto+de+software." target="_blank" rel="noopener noreferrer" className="text-white/75 hover:text-white/60">Chame no WhatsApp</a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
