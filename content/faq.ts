export interface FAQItem {
  question: string;
  answer: string;
  category: "processo" | "tecnico" | "negocio";
}

export const faqs: FAQItem[] = [
  {
    category: "negocio",
    question: "O que a Peluga Labs faz?",
    answer:
      "A Peluga Labs é uma empresa de desenvolvimento de software: criamos sistemas web sob medida, aplicativos mobile, sites, e-commerces, integrações entre sistemas e automações com inteligência artificial, além de manter e evoluir sistemas em produção.",
  },
  {
    category: "negocio",
    question: "Vocês atendem em quais regiões?",
    answer:
      "Somos de Belo Horizonte e atendemos empresas de todo o Brasil. As reuniões podem ser presenciais em BH e região ou online.",
  },
  {
    category: "processo",
    question: "Como funciona o diagnóstico gratuito?",
    answer:
      "Em uma conversa sem custo e sem compromisso, entendemos o problema, o processo atual e os sistemas que você já usa. Você sai com uma proposta de escopo, as etapas sugeridas e uma estimativa de prazo e investimento.",
  },
  {
    category: "negocio",
    question: "Quanto custa desenvolver um software?",
    answer:
      "Depende do escopo, das integrações e da complexidade das regras de negócio. Por isso dividimos o projeto em etapas: você começa pelo que gera mais valor, com investimento previsível, e expande conforme os resultados aparecem.",
  },
  {
    category: "processo",
    question: "Quanto tempo leva para o projeto ficar pronto?",
    answer:
      "Uma primeira versão utilizável costuma sair entre 4 e 12 semanas. Trabalhamos com entregas incrementais a cada ciclo curto, então você acompanha, testa e usa o software antes do projeto inteiro terminar.",
  },
  {
    category: "processo",
    question: "Como acompanho o andamento do projeto?",
    answer:
      "Você tem acesso a um ambiente de testes atualizado a cada entrega, reuniões curtas de alinhamento e um canal direto com a equipe. Nada de meses sem ver o que está sendo feito.",
  },
  {
    category: "tecnico",
    question: "Com quais tecnologias vocês trabalham?",
    answer:
      "Usamos tecnologias modernas e consolidadas, como TypeScript, React, Next.js, Node.js, Python, React Native, PostgreSQL e as principais nuvens (AWS, Google Cloud e Vercel). A escolha é feita conforme o projeto, não por moda.",
  },
  {
    category: "tecnico",
    question: "O código-fonte fica com a minha empresa?",
    answer:
      "Sim. Código, documentação e dados são da sua empresa. Você pode continuar com a Peluga Labs ou levar o projeto para outra equipe quando quiser, sem aprisionamento.",
  },
  {
    category: "tecnico",
    question: "Vocês assumem sistemas feitos por outra empresa?",
    answer:
      "Sim. Fazemos uma análise técnica do código e da infraestrutura, documentamos o que existe e montamos um plano para estabilizar e evoluir o sistema sem parar a operação.",
  },
  {
    category: "negocio",
    question: "Quais são as opções de contratação?",
    answer:
      "Projetos com escopo fechado, pacotes mensais de horas para evolução e sustentação, ou uma equipe dedicada ao seu produto. O modelo é definido depois do diagnóstico, conforme o momento da empresa.",
  },
];
