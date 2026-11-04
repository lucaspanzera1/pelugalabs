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

export async function trackPageView(page: string, title: string): Promise<void> {
  try {
    const userId = getOrCreateUserId();
    const sessionId = getOrCreateSessionId();

    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'page_view',
        user_id: userId,
        session_id: sessionId,
        page,
        title,
        referrer: document.referrer || null,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        timestamp: new Date().toISOString(),
        ...getUtmParams(),
      }),
    });
  } catch {
    // Analytics never break the user experience
  }
}
