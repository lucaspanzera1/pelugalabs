import { renderOgCard, ogSize } from "@/components/og-card";

export const alt = "Peluga Labs — Desenvolvimento de Software Sob Medida em Belo Horizonte";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard({
    eyebrow: "Belo Horizonte · MG",
    title: "Desenvolvimento de software sob medida",
  });
}
