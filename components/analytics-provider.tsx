'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { initTracker, trackPageView } from '@/utils/analytics';

/**
 * Liga o tracker (todos os cliques, scroll, seções, formulários, tempo na página)
 * e registra um page view a cada troca de rota.
 * Use data-track="nome" num link/botão para dar um rótulo ao clique;
 * data-no-track para não registrar cliques num trecho.
 */
export default function AnalyticsProvider() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => initTracker(), []);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      // Espera o Next atualizar o document.title
      const timeout = setTimeout(() => trackPageView(pathname), 100);
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  return null;
}
