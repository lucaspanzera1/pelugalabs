import React from 'react';

export default function Pricing() {
  const tiers = [
    {
      name: 'Diagnóstico',
      price: 'Sob consulta',
      features: [
        'Auditoria de ativos e infraestrutura',
        'Levantamento de riscos e vulnerabilidades',
        'Relatório executivo com plano de ação',
        'Reunião de apresentação dos resultados'
      ],
      delivery: '1-2 semanas',
      popular: false
    },
    {
      name: 'Implementação',
      price: 'Sob consulta',
      features: [
        'Implementação de Active Directory, Workspace ou rede',
        'Migração e configuração de políticas de segurança',
        'Documentação técnica completa',
        'Suporte durante todo o rollout'
      ],
      delivery: '3-8 semanas',
      popular: true
    },
    {
      name: 'Gestão Contínua',
      price: 'Contrato mensal',
      features: [
        'Suporte e monitoramento 24/7',
        'Gestão contínua de ativos, identidades e rede',
        'SLA definido em contrato',
        'Relatório periódico de performance'
      ],
      delivery: 'Contínuo',
      popular: false
    }
  ];

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-white/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-white/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-white/50">
              <span className="inline-flex text-white font-semibold text-sm">
                Modelos de Parceria
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-white),#c7d2fe,var(--color-white),#c7d2fe,var(--color-white))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Governança sob medida para o seu porte
            </h2>
            <p className="text-lg text-white/60">
              Da consultoria pontual à gestão total da sua TI — escolha o nível de parceria que sua empresa precisa hoje.
            </p>
          </div>
          {/* Pricing cards */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 md:gap-x-14 md:gap-y-16 lg:grid-cols-3">
            {tiers.map((tier, index) => (
              <div key={index} className={`relative rounded-2xl bg-white/50 p-6 shadow-xl ${tier.popular ? 'ring-2 ring-white' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#172E6E]">
                    MAIS POPULAR
                  </div>
                )}
                <div className="text-center">
                  <h3 className="mb-2 font-nacelle text-xl font-semibold text-white/95">{tier.name}</h3>
                  <div className="mb-4 text-3xl font-bold text-white/75">{tier.price}</div>
                  <ul className="mb-6 space-y-2 text-left text-sm text-white/60">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg className="mr-2 h-4 w-4 fill-white/85" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mb-4 text-sm text-white/60">
                    Prazo: {tier.delivery}
                  </div>
                  <a
                    className="btn group w-full bg-white hover:bg-slate-100 text-[#172E6E] transition-colors"
                    href="https://api.whatsapp.com/send/?phone=5531991826043"
                    target="_blank"
                  >
                    <span className="relative inline-flex items-center">
                      Vamos Conversar
                      <span className="ml-1 tracking-normal text-[#172E6E]/60 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}