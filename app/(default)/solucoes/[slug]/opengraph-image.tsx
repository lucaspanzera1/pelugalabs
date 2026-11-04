import { renderOgCard, ogSize } from "@/components/og-card";
import { solucoes } from "@/content/solucoes";

export const alt = "Peluga Labs — Soluções em desenvolvimento de software";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return solucoes.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solucao = solucoes.find((s) => s.slug === slug);

  return renderOgCard({
    eyebrow: "Desenvolvimento de software · Belo Horizonte",
    title: solucao?.title ?? "Desenvolvimento de software sob medida",
  });
}
