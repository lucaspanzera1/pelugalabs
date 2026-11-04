import { solucoes } from "@/content/solucoes";
import { notFound } from "next/navigation";
import SolutionContent from "./SolutionContent";
import { Metadata } from "next";
import { SITE_URL, BUSINESS_ID, AREA_SERVED, faqPageJsonLd, breadcrumbJsonLd } from "@/content/seo";

export function generateStaticParams() {
  return solucoes.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solucao = solucoes.find((s) => s.slug === slug);

  if (!solucao) return {};

  const url = `${SITE_URL}/solucoes/${slug}`;

  return {
    title: solucao.seo.title,
    description: solucao.seo.description,
    keywords: solucao.seo.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title: `${solucao.seo.title} | Peluga Labs`,
      description: solucao.seo.description,
      url,
    },
    twitter: {
      title: `${solucao.seo.title} | Peluga Labs`,
      description: solucao.seo.description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solucao = solucoes.find((s) => s.slug === slug);

  if (!solucao) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                "name": solucao.title,
                "serviceType": solucao.title,
                "description": solucao.seo.description,
                "url": `${SITE_URL}/solucoes/${solucao.slug}`,
                "provider": { "@id": BUSINESS_ID },
                "areaServed": AREA_SERVED,
              },
              faqPageJsonLd(solucao.faqs),
              breadcrumbJsonLd([
                { name: "Início", path: "/" },
                { name: "Soluções", path: "/#features" },
                { name: solucao.title, path: `/solucoes/${solucao.slug}` },
              ]),
            ]
          })
        }}
      />
      <SolutionContent solucao={solucao} />
    </>
  );
}
