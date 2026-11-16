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
