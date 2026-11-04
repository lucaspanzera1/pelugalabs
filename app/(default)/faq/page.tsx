import type { Metadata } from "next";
import FAQ from "@/components/faq";
import PageIllustration from "@/components/page-illustration";
import { faqs } from "@/content/faq";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/content/seo";

export const metadata: Metadata = {
  title: "Perguntas Frequentes sobre Desenvolvimento de Software",
  description:
    "Dúvidas sobre desenvolvimento de software sob medida: prazos, custos, tecnologias, código-fonte e suporte. Respostas da Peluga Labs, de Belo Horizonte.",
  alternates: {
    canonical: "https://labs.peluga.com.br/faq",
  },
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              faqPageJsonLd(faqs),
              breadcrumbJsonLd([
                { name: "Início", path: "/" },
                { name: "Perguntas Frequentes", path: "/faq" },
              ]),
            ],
          }),
        }}
      />
      <PageIllustration />
      <div className="pt-32">
        <FAQ />
      </div>
    </>
  );
}
