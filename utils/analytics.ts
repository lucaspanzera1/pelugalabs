const USER_COOKIE = 'peluga_uid';
const SESSION_COOKIE = 'peluga_sid';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

function generateId(): string {
  return crypto.randomUUID();
}

export function getOrCreateUserId(): string {
  let uid = getCookie(USER_COOKIE);
  if (!uid) {
    uid = generateId();
    setCookie(USER_COOKIE, uid, 365 * 24 * 60 * 60);
  }
  return uid;
}

export function getOrCreateSessionId(): string {
  let sid = getCookie(SESSION_COOKIE);
  if (!sid) {
    sid = generateId();
  }
  setCookie(SESSION_COOKIE, sid, 30 * 60);
  return sid;
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
      visitorId: getOrCreateUserId(),
    };
  } catch {
    return { form };
  }
}

function send(payload: Record<string, unknown>): void {
  const body = JSON.stringify({
    user_id: getOrCreateUserId(),
    session_id: getOrCreateSessionId(),
    page: window.location.pathname,
    title: document.title,
    referrer: document.referrer || null,
    language: navigator.language,
    screen: `${screen.width}x${screen.height}`,
    timestamp: new Date().toISOString(),
    ...getUtmParams(),
    ...payload,
  });
  // keepalive: o evento chega mesmo se o usuário sair da página (ex: clique em link externo)
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function trackPageView(page: string, title: string): void {
  try {
    rememberFirstTouch();
    send({ event: 'page_view', page, title });
  } catch {
    // Analytics never break the user experience
  }
}

/**
 * Evento customizado (conversão, clique...). Ex:
 *   trackEvent('whatsapp_click', { label: 'footer' })
 *   trackEvent('lead_submit', { form: 'budget' })
 */
export function trackEvent(event: string, properties?: Record<string, string | number | boolean>): void {
  try {
    send({ event, properties });
  } catch {
    // Analytics never break the user experience
  }
}
