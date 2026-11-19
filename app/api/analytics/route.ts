import { NextRequest, NextResponse } from 'next/server';

/** Identifica este site no analytics do servicedesk */
const SITE = 'labs.peluga.com.br';
const TRACK_URL =
  process.env.SERVICEDESK_ANALYTICS_URL ?? 'https://servicedesk.peluga.com.br/api/analytics/track';
const BATCH_URL = TRACK_URL.replace(/\/track\/?$/, '/batch');
const MAX_EVENTS = 100;

const FIELDS = [
  'event', 'user_id', 'session_id', 'page', 'title', 'referrer', 'language', 'screen', 'timestamp',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'properties',
] as const;

function pick(body: Record<string, unknown>): Record<string, unknown> | null {
  if (!body || typeof body !== 'object' || !body.event || !body.user_id || !body.session_id || !body.page) return null;
  const out: Record<string, unknown> = { source: SITE };
  for (const key of FIELDS) {
    const v = body[key];
    if (v !== undefined && v !== null && v !== '') out[key] = v;
  }
  return out;
}

/**
 * Proxy server-side para o analytics do servicedesk.
 * Mantém a chave de ingestão fora do navegador e repassa IP, user-agent e
 * localização (headers de geo da Vercel) reais do visitante.
 * Aceita um evento ({ event, ... }) ou um lote ({ events: [...] }) do tracker.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const batch = Array.isArray(body?.events);
    const events = (batch ? (body.events as Record<string, unknown>[]) : [body])
      .slice(0, MAX_EVENTS)
      .map(pick)
      .filter((e): e is Record<string, unknown> => e !== null);
    if (!events.length) {
      return NextResponse.json({ ok: false, error: 'missing required fields' }, { status: 400 });
    }

    const h = (name: string) => req.headers.get(name) ?? '';
    const response = await fetch(batch ? BATCH_URL : TRACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-analytics-key': process.env.SERVICEDESK_ANALYTICS_KEY ?? '',
        'x-visitor-ip': h('x-forwarded-for').split(',')[0]?.trim() || h('x-real-ip'),
        'x-visitor-ua': h('user-agent'),
        'x-visitor-country': h('x-vercel-ip-country'),
        'x-visitor-region': h('x-vercel-ip-country-region'),
        'x-visitor-city': h('x-vercel-ip-city'),
      },
      body: JSON.stringify(batch ? { events } : events[0]),
    });

    return NextResponse.json({ ok: response.ok });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
