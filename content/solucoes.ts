export interface Solucao {
  slug: string;
  title: string;
  description: string;
  icon: string; // SVG path (viewBox 0 -960 960 960)
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  details: {
    heroTitle: string;
    heroSubtitle: string;
    features: {
      title: string;
      description: string;
    }[];
    benefits: string[];
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const solucoes: Solucao[] = [
  {
    slug: "desenvolvimento-de-sistemas",
    title: "Sistemas Web Sob Medida",
    description: "Sistemas corporativos feitos para as regras do seu negócio, que substituem planilhas, retrabalho e softwares genéricos que não se encaixam.",
    icon: "M320-240 80-480l240-240 57 57-183 183 183 183-57 57Zm320 0-57-57 183-183-183-183 57-57 240 240-240 240Z",
    seo: {
      title: "Desenvolvimento de Sistemas Sob Medida em BH",
      description: "Desenvolvimento de sistemas web sob medida em Belo Horizonte: ERPs, CRMs, portais e painéis internos construídos para as regras do seu negócio.",
      keywords: ["desenvolvimento de sistemas", "software sob medida", "sistema personalizado", "sistema web", "fábrica de software Belo Horizonte", "desenvolvimento de software BH"],
    },
    details: {
      heroTitle: "Sistemas Sob Medida para a Operação Real da Sua Empresa",
      heroSubtitle: "Do levantamento de processos ao deploy: construímos o sistema que a sua equipe precisa, em vez de adaptar a empresa a um software genérico.",
      features: [
        { title: "Levantamento de Processos", description: "Mapeamos o fluxo real da operação antes de escrever qualquer linha de código." },
        { title: "Entregas Incrementais", description: "Versões funcionais a cada ciclo curto, para você usar, validar e ajustar o rumo cedo." },
        { title: "Código e Dados Seus", description: "Código-fonte, documentação e banco de dados entregues. Sem aprisionamento em fornecedor." }
      ],
      benefits: ["Fim do retrabalho manual e das planilhas soltas", "Processos padronizados entre equipes", "Sistema que evolui junto com a empresa"]
    },
    faqs: [
      { question: "Quanto custa desenvolver um sistema sob medida?", answer: "Depende do escopo, das integrações e do número de perfis de usuário. Depois do diagnóstico gratuito, entregamos uma estimativa por etapas, para você começar pelo que gera mais valor e expandir depois." },
      { question: "Quanto tempo leva para o sistema ficar pronto?", answer: "Uma primeira versão utilizável costuma sair entre 4 e 12 semanas. Trabalhamos com entregas incrementais, então você usa partes do sistema antes do projeto inteiro terminar." },
      { question: "O código fica com a minha empresa?", answer: "Sim. O código-fonte, a documentação e os dados são da sua empresa. Você pode continuar com a Peluga Labs ou levar o projeto para outra equipe quando quiser." }
    ]
  },
  {
    slug: "aplicativos-mobile",
    title: "Aplicativos Mobile",
    description: "Apps para iOS e Android, para clientes ou equipes de campo, com publicação nas lojas, notificações e funcionamento offline.",
    icon: "M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm0-120v40h400v-40H280Zm0-80h400v-480H280v480Zm0-560h400v-40H280v40Zm0 0v-40 40Zm0 640v40-40Z",
    seo: {
      title: "Desenvolvimento de Aplicativos iOS e Android",
      description: "Desenvolvimento de aplicativos mobile para iOS e Android: apps para clientes e equipes de campo, com publicação nas lojas, notificações push e modo offline.",
      keywords: ["desenvolvimento de aplicativos", "criar aplicativo", "app iOS e Android", "React Native", "aplicativo para empresa", "desenvolvimento mobile BH"],
    },
    details: {
      heroTitle: "Aplicativos que as Pessoas Realmente Usam",
      heroSubtitle: "Apps para iOS e Android com uma base de código só, pensados para o dia a dia de quem vai usar: seu cliente ou sua equipe na rua.",
      features: [
        { title: "iOS e Android de Uma Vez", description: "Desenvolvimento multiplataforma que reduz custo e prazo sem abrir mão da experiência nativa." },
        { title: "Offline e Notificações", description: "Funciona sem internet, sincroniza depois e avisa o usuário na hora certa." },
        { title: "Publicação nas Lojas", description: "Cuidamos de todo o processo de publicação na App Store e no Google Play." }
      ],
      benefits: ["Canal direto com o seu cliente", "Equipes de campo sem papel e sem retrabalho", "Um só código para as duas plataformas"]
    },
    faqs: [
      { question: "Preciso de um app ou um sistema web resolve?", answer: "Se o uso depende de câmera, GPS, notificações ou funcionamento offline, um app costuma valer a pena. Caso contrário, um sistema web responsivo pode resolver com custo menor. Indicamos o caminho no diagnóstico." },
      { question: "Vocês publicam o app nas lojas?", answer: "Sim. Preparamos contas, telas, descrições e cuidamos da submissão e da aprovação na App Store e no Google Play." },
      { question: "O app conversa com o sistema que já usamos?", answer: "Sim. Integramos o aplicativo ao seu ERP, CRM ou banco de dados por APIs, para não haver digitação duplicada." }
    ]
  },
  {
    slug: "sites-e-aplicacoes-web",
    title: "Sites & Aplicações Web",
    description: "Sites institucionais, landing pages e portais rápidos, otimizados para o Google e feitos para transformar visitas em contatos.",
    icon: "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T322-782q-56 18-99.5 55T150-640Z",
    seo: {
      title: "Criação de Sites e Aplicações Web em BH",
      description: "Criação de sites institucionais, landing pages e aplicações web em Belo Horizonte: carregamento rápido, SEO técnico e foco em conversão.",
      keywords: ["criação de sites", "desenvolvimento web", "landing page", "site institucional", "Next.js", "criação de sites Belo Horizonte"],
    },
    details: {
      heroTitle: "Sites Rápidos que Aparecem no Google e Geram Contatos",
      heroSubtitle: "Sites e aplicações web construídos com tecnologia moderna, carregamento instantâneo e SEO técnico desde o primeiro deploy.",
      features: [
        { title: "Performance de Verdade", description: "Páginas leves e rápidas, com nota alta no Core Web Vitals do Google." },
        { title: "SEO Técnico", description: "Estrutura, metadados e dados estruturados pensados para ranquear desde o início." },
        { title: "Fácil de Atualizar", description: "Conteúdo editável sem depender de programador para cada mudança de texto." }
      ],
      benefits: ["Mais visitas orgânicas", "Mais contatos por visita", "Hospedagem, domínio e SSL sob controle"]
    },
    faqs: [
      { question: "Vocês usam WordPress?", answer: "Escolhemos a tecnologia conforme o projeto. Para a maioria dos sites usamos Next.js, que entrega mais velocidade e segurança, com um painel de conteúdo para a sua equipe editar textos e imagens." },
      { question: "O site já sai otimizado para o Google?", answer: "Sim. Entregamos SEO técnico: URLs limpas, metadados, sitemap, dados estruturados e carregamento rápido. Também orientamos a estratégia de conteúdo." },
      { question: "Vocês cuidam da hospedagem?", answer: "Sim. Podemos cuidar de hospedagem, domínio, certificado SSL e backups, ou publicar na infraestrutura que a sua empresa já usa." }
    ]
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    description: "Lojas virtuais integradas a pagamento, frete, estoque e ERP, preparadas para aguentar picos de venda sem sair do ar.",
    icon: "M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h440v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Z",
    seo: {
      title: "Desenvolvimento de E-commerce e Loja Virtual",
      description: "Desenvolvimento de e-commerce e loja virtual integrada a pagamento, frete, estoque e ERP, com alta performance e checkout otimizado.",
      keywords: ["desenvolvimento de e-commerce", "loja virtual", "criar loja online", "integração com ERP", "checkout", "e-commerce sob medida"],
    },
    details: {
      heroTitle: "Lojas Virtuais que Vendem Mais e Não Caem no Pico",
      heroSubtitle: "E-commerce integrado ao seu estoque, ERP, meios de pagamento e transportadoras, com checkout rápido e operação automatizada.",
      features: [
        { title: "Checkout que Converte", description: "Fluxo de compra curto, com Pix, cartão e boleto, pensado para reduzir carrinhos abandonados." },
        { title: "Integrações de Operação", description: "Estoque, ERP, emissão de nota e frete conectados, sem digitação manual de pedidos." },
        { title: "Preparado para Picos", description: "Infraestrutura que escala em datas de promoção e campanhas." }
      ],
      benefits: ["Menos carrinhos abandonados", "Pedidos processados automaticamente", "Loja no ar mesmo na Black Friday"]
    },
    faqs: [
      { question: "Vocês trabalham com plataformas prontas ou só sob medida?", answer: "Os dois. Avaliamos se uma plataforma como Shopify ou Nuvemshop, com integrações customizadas, resolve. Quando a operação tem regras muito específicas, desenvolvemos a loja sob medida." },
      { question: "A loja integra com o meu ERP?", answer: "Sim. Integramos estoque, preços, pedidos e notas fiscais com os principais ERPs do mercado, por API ou por conectores." },
      { question: "Quais meios de pagamento podem ser usados?", answer: "Pix, cartão de crédito, boleto e carteiras digitais, com gateways como Mercado Pago, Pagar.me, Stripe e outros." }
    ]
  },
  {
    slug: "integracoes-e-apis",
    title: "Integrações & APIs",
    description: "Conectamos ERP, CRM, pagamentos, WhatsApp e demais sistemas para os dados fluírem sozinhos entre as áreas da empresa.",
    icon: "M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z",
    seo: {
      title: "Integração de Sistemas e Desenvolvimento de APIs",
      description: "Integração de sistemas e desenvolvimento de APIs: conecte ERP, CRM, e-commerce, meios de pagamento e WhatsApp e acabe com a digitação duplicada.",
      keywords: ["integração de sistemas", "desenvolvimento de API", "integração com ERP", "API REST", "integração WhatsApp", "webhooks"],
    },
    details: {
      heroTitle: "Seus Sistemas Conversando entre Si, Sem Digitação Duplicada",
      heroSubtitle: "APIs e integrações que conectam as ferramentas que a sua empresa já usa, para cada informação ser digitada uma vez só.",
      features: [
        { title: "Integração de Sistemas", description: "ERP, CRM, e-commerce, financeiro e planilhas sincronizados automaticamente." },
        { title: "APIs Sob Medida", description: "APIs seguras e documentadas para parceiros, apps e sistemas internos." },
        { title: "Monitoramento de Falhas", description: "Alertas e reprocessamento automático quando um sistema externo falha." }
      ],
      benefits: ["Fim da digitação duplicada", "Dados consistentes entre as áreas", "Menos erros operacionais"]
    },
    faqs: [
      { question: "Dá para integrar um sistema que não tem API?", answer: "Muitas vezes sim, por banco de dados, arquivos, e-mail ou automação de tela. Avaliamos a opção mais segura e estável para cada caso." },
      { question: "Vocês integram com o WhatsApp?", answer: "Sim. Usamos a API oficial do WhatsApp Business para notificações, atendimento automatizado e envio de documentos." },
      { question: "O que acontece se a integração falhar?", answer: "As integrações têm registro, alertas e reprocessamento automático. Se um sistema externo cair, nada se perde: os dados são enviados quando ele voltar." }
    ]
  },
  {
    slug: "automacao-e-ia",
    title: "Automação & Inteligência Artificial",
    description: "Automação de processos e assistentes com IA que atendem clientes, leem documentos e liberam a equipe de tarefas repetitivas.",
    icon: "m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z",
    seo: {
      title: "Automação de Processos e Soluções com IA",
      description: "Automação de processos e soluções com inteligência artificial para empresas: chatbots, leitura de documentos, relatórios automáticos e assistentes internos.",
      keywords: ["automação de processos", "inteligência artificial para empresas", "chatbot com IA", "IA generativa", "automação de tarefas", "agentes de IA"],
    },
    details: {
      heroTitle: "Automação e IA Aplicadas a Problemas Reais da Operação",
      heroSubtitle: "Nada de IA por modismo: identificamos tarefas repetitivas que custam horas da sua equipe e automatizamos com segurança.",
      features: [
        { title: "Assistentes com IA", description: "Atendimento e suporte que respondem com base nos dados e documentos da sua empresa." },
        { title: "Leitura de Documentos", description: "Extração automática de dados de notas, contratos, pedidos e formulários." },
        { title: "Fluxos Automatizados", description: "Relatórios, cobranças, aprovações e notificações que rodam sozinhos." }
      ],
      benefits: ["Horas de trabalho manual devolvidas à equipe", "Atendimento rápido a qualquer hora", "Menos erros de digitação"]
    },
    faqs: [
      { question: "Meus dados ficam seguros usando IA?", answer: "Sim. Usamos provedores com garantia de que os dados não são usados para treinar modelos, controle de acesso por perfil e registro de uso." },
      { question: "Por onde começar a automatizar?", answer: "Pelas tarefas repetitivas de alto volume, como triagem de atendimento, digitação de documentos e relatórios. No diagnóstico gratuito apontamos as que dão retorno mais rápido." },
      { question: "A IA substitui a minha equipe?", answer: "A ideia é tirar da equipe o trabalho repetitivo, para ela se concentrar no que exige julgamento. Os fluxos sempre têm revisão humana onde o risco pede." }
    ]
  },
  {
    slug: "sustentacao-e-evolucao",
    title: "Sustentação & Evolução de Software",
    description: "Manutenção, correções, novas funcionalidades e cloud para sistemas que já existem, inclusive os que foram feitos por outra equipe.",
    icon: "M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z",
    seo: {
      title: "Manutenção e Sustentação de Software",
      description: "Manutenção, sustentação e evolução de sistemas: correções, novas funcionalidades, modernização de legado, cloud e monitoramento com SLA.",
      keywords: ["manutenção de software", "sustentação de sistemas", "modernização de sistema legado", "DevOps", "migração para nuvem", "suporte a sistemas"],
    },
    details: {
      heroTitle: "Seu Sistema Estável Hoje e Evoluindo Amanhã",
      heroSubtitle: "Assumimos sistemas em produção, mesmo os feitos por outra equipe, com correções rápidas, melhorias contínuas e infraestrutura em nuvem monitorada.",
      features: [
        { title: "Correções com SLA", description: "Bugs priorizados e resolvidos com prazos definidos em contrato." },
        { title: "Modernização de Legado", description: "Atualizamos tecnologias antigas em etapas, sem parar a operação." },
        { title: "Cloud & DevOps", description: "Deploy automatizado, backups, monitoramento e custo de nuvem sob controle." }
      ],
      benefits: ["Menos quedas e incidentes", "Novas funcionalidades em ritmo previsível", "Custo de nuvem otimizado"]
    },
    faqs: [
      { question: "Vocês assumem sistemas feitos por outra empresa?", answer: "Sim. Começamos com uma análise técnica do código e da infraestrutura, documentamos o que existe e montamos um plano de estabilização e evolução." },
      { question: "Como funciona o contrato de sustentação?", answer: "É um pacote mensal de horas ou uma equipe dedicada, com SLA para correções, canal de atendimento e um roadmap de melhorias combinado com você." },
      { question: "Vale a pena reescrever um sistema legado do zero?", answer: "Raramente de uma vez só. Na maioria dos casos é mais seguro modernizar por partes, substituindo módulos aos poucos enquanto o sistema segue funcionando." }
    ]
  }
];
