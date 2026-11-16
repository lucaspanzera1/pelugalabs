'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, trackPageView } from '@/utils/analytics';

/** Classifica cliques em links que importam para conversão */
function classifyLink(a: HTMLAnchorElement): { event: string; target: string } | null {
  const href = a.getAttribute('href') ?? '';
  if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) return { event: 'whatsapp_click', target: 'whatsapp' };
  if (href.startsWith('mailto:')) return { event: 'email_click', target: href.slice(7).split('?')[0] };
  if (href.startsWith('tel:')) return { event: 'phone_click', target: href.slice(4) };
  try {
    const url = new URL(a.href, window.location.href);
    if (/^https?:$/.test(url.protocol) && url.hostname !== window.location.hostname) {
      return { event: 'outbound_click', target: url.hostname };
    }
  } catch {
    /* href inválido */
  }
  return null;
}

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      // Wait for the document title to be updated by Next.js
      const timeout = setTimeout(() => {
        trackPageView(pathname, document.title);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  // Cliques em WhatsApp, e-mail, telefone e links externos — sem precisar instrumentar cada componente.
  // Use data-track="nome" num link/botão para dar um rótulo ao clique.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('a, [data-track]');
      if (!el) return;
      const label = el.getAttribute('data-track') ?? (el.textContent ?? '').trim().slice(0, 60);
      const link = el instanceof HTMLAnchorElement ? classifyLink(el) : null;
      if (link) trackEvent(link.event, { target: link.target, label });
      else if (el.hasAttribute('data-track')) trackEvent('cta_click', { label });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
