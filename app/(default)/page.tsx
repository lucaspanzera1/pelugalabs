import type { Metadata } from "next";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, faqPageJsonLd } from "@/content/seo";
import { faqs } from "@/content/faq";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import BlogPreview from "@/components/blog-preview";
import FAQ from "@/components/faq";
import Cta from "@/components/cta";
import WhatsAppButton from "@/components/whatsapp-button";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [faqPageJsonLd(faqs)],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageIllustration />
      <Hero />
      <Features />
      <Workflows />
      <Cta />
      <BlogPreview />
      <FAQ />
      <WhatsAppButton />
    </>
  );
}

