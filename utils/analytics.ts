/**
 * Analytics do site → servicedesk. O trabalho todo (cliques, scroll, seções,
 * formulários, tempo na página...) está em ./tracker.ts — mesmo núcleo do Giro e do Labs.
 */
import { getVisitorId, getSessionId, track, trackPageView as trackerPageView } from './tracker';

export { initTracker, flush } from './tracker';

export function getOrCreateUserId(): string {
  return getVisitorId();
}

export function getOrCreateSessionId(): string {
  return getSessionId();
}

function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
    const value = params.get(key);
    if (value) result[key] = value;
  });
  return result;
}

const FIRST_TOUCH_KEY = 'peluga_first_touch';

/** Como o visitante chegou na primeira visita — sobrevive até ele virar lead. */
export interface FirstTouch {
  landingPage: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  firstSeenAt: string;
}

function isExternal(url: string): boolean {
  try {
    return new URL(url).hostname.replace(/^www\./, '') !== window.location.hostname.replace(/^www\./, '');
  } catch {
    return false;
  }
}

/** Guarda a primeira origem do visitante (uma vez só). */
function rememberFirstTouch(): void {
  try {
    if (localStorage.getItem(FIRST_TOUCH_KEY)) return;
    const utm = getUtmParams();
    const ref = document.referrer && isExternal(document.referrer) ? document.referrer : undefined;
    const ft: FirstTouch = {
      landingPage: window.location.pathname,
      referrer: ref,
      utmSource: utm.utm_source,
      utmMedium: utm.utm_medium,
      utmCampaign: utm.utm_campaign,
      utmContent: utm.utm_content,
      utmTerm: utm.utm_term,
      firstSeenAt: new Date().toISOString(),
    };
    localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(ft));
  } catch {
    // localStorage indisponível (modo privado, bloqueado): segue sem first touch
  }
}

function readFirstTouch(): Partial<FirstTouch> {
  try {
    return JSON.parse(localStorage.getItem(FIRST_TOUCH_KEY) || '{}');
  } catch {
    return {};
  }
}

/**
 * Origem do lead para mandar junto com um formulário: site, página, visitante
 * do analytics (liga o lead à jornada no CRM) e a primeira origem conhecida.
 */
export function getLeadOrigin(form: string): Record<string, string | undefined> {
  try {
    return {
      ...readFirstTouch(),
      site: window.location.hostname,
      page: window.location.pathname,
      form,
      visitorId: getVisitorId(),
    };
  } catch {
    return { form };
  }
}

export function trackPageView(page: string): void {
  try {
    rememberFirstTouch();
    trackerPageView(page);
  } catch {
    // Analytics never break the user experience
  }
}

/**
 * Evento customizado (conversão, clique...). Ex:
 *   trackEvent('lead_submit', { form: 'budget' })
 * Cliques já são capturados sozinhos — use data-track="nome" para dar rótulo a um.
 */
export function trackEvent(event: string, properties?: Record<string, string | number | boolean>): void {
  track(event, properties);
}
