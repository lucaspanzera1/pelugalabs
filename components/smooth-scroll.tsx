"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToElement(el: HTMLElement, duration = 1200) {
  const targetY = el.getBoundingClientRect().top + window.scrollY - 80;
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime: number | null = null;

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

// Scroll suave com mouse wheel
function useSmoothWheel() {
  useEffect(() => {
    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId: number | null = null;
    const ease = 1.2;

    const animate = () => {
      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.5) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        rafId = null;
        return;
      }
      currentY += diff * ease;
      window.scrollTo(0, currentY);
      rafId = requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Reseta se a posição foi alterada externamente (ex: navegação entre rotas)
      if (Math.abs(window.scrollY - currentY) > 10) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
      const maxY = document.body.scrollHeight - window.innerHeight;
      targetY = Math.min(Math.max(targetY + e.deltaY, 0), maxY);
      if (!rafId) rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}

export default function SmoothScroll() {
  const pathname = usePathname();
  useSmoothWheel();

  // Ao mudar de rota: sem hash → topo; com hash → seção
  useEffect(() => {
    const hash = window.location.hash.slice(1);

    const timer = setTimeout(() => {
      if (hash) {
        const el = document.getElementById(hash);
        if (el) scrollToElement(el);
      } else {
        window.scrollTo(0, 0);
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Intercepta cliques em links âncora na mesma página
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // "Home" (href="/") na home page → rola suavemente ao topo
      if (href === "/" && window.location.pathname === "/") {
        e.preventDefault();
        
        history.pushState(null, "", "/");
        // Trigger hashchange manually for state managers
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        
        const startY = window.scrollY;
        const duration = 1200;
        let startTime: number | null = null;
        const easeInOutCubic = (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          window.scrollTo(0, startY * (1 - easeInOutCubic(progress)));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        return;
      }

      // Captura "/#section" e "#section"
      const hashMatch = href.match(/^(?:\/)?#(.+)$/);
      if (!hashMatch) return;

      const id = hashMatch[1];
      const el = document.getElementById(id);
      if (!el) return; // Elemento não existe nessa página → deixa o Next.js navegar

      e.preventDefault();

      history.pushState(null, "", `#${id}`);
      // Trigger hashchange manually so Header/Menu can close
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      
      scrollToElement(el);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
