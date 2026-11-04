import { solucoes } from "./solucoes";

export const SITE_URL = "https://labs.peluga.com.br";
export const BUSINESS_ID = `${SITE_URL}/#business`;

// Gerada por app/opengraph-image.tsx. Precisa ser referenciada explicitamente
// em toda página que define `openGraph`, pois o objeto da página substitui o herdado.
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Peluga Labs — Desenvolvimento de Software Sob Medida em Belo Horizonte",
};

export const SITE_TITLE = "Peluga Labs | Desenvolvimento de Software Sob Medida em BH";
export const SITE_DESCRIPTION =
  "Desenvolvimento de software sob medida em Belo Horizonte: sistemas web, aplicativos mobile, sites, e-commerce, integrações e automação com inteligência artificial.";

export const SITE_KEYWORDS = [
  "desenvolvimento de software",
  "software sob medida",
  "desenvolvimento de sistemas",
  "fábrica de software Belo Horizonte",
  "empresa de software BH",
  "desenvolvimento de aplicativos",
  "criação de sites",
  "desenvolvimento web",
  "e-commerce sob medida",
  "integração de sistemas",
  "desenvolvimento de API",
  "automação de processos",
  "inteligência artificial para empresas",
  "manutenção de software",
  "Belo Horizonte",
  "Peluga Labs",
];

export const AREA_SERVED = [
  { "@type": "City", name: "Belo Horizonte" },
  { "@type": "City", name: "Contagem" },
  { "@type": "City", name: "Betim" },
  { "@type": "City", name: "Nova Lima" },
  { "@type": "State", name: "Minas Gerais" },
];

export function localBusinessJsonLd() {
  return {
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: "Peluga Labs",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/opengraph-image`,
    description: SITE_DESCRIPTION,
    telephone: "+55-31-99182-6043",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Belo Horizonte",
      addressRegion: "MG",
      postalCode: "30720-520",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -19.9167,
      longitude: -43.9345,
    },
    areaServed: AREA_SERVED,
    knowsAbout: [
      "Desenvolvimento de software",
      "Sistemas web sob medida",
      "Aplicativos mobile",
      "Desenvolvimento web",
      "E-commerce",
      "Integração de sistemas e APIs",
      "Automação de processos",
      "Inteligência artificial",
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-31-99182-6043",
      contactType: "sales",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de desenvolvimento de software",
      itemListElement: solucoes.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
          url: `${SITE_URL}/solucoes/${s.slug}`,
        },
      })),
    },
    sameAs: [
      "https://www.instagram.com/peluga.com.br/",
      "https://linkedin.com/company/peluga",
    ],
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
