import { NextRequest, NextResponse } from 'next/server';

/** Identifica este site no analytics do servicedesk */
const SITE = 'labs.peluga.com.br';
const ENDPOINT =
  process.env.SERVICEDESK_ANALYTICS_URL ?? 'https://servicedesk.peluga.com.br/api/analytics/track';

const FIELDS = [
  'event', 'user_id', 'session_id', 'page', 'title', 'referrer', 'language', 'screen', 'timestamp',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'properties',
] as const;

/**
 * Proxy server-side para o analytics do servicedesk.
 * Mantém a chave de ingestão fora do navegador e repassa IP/UA reais do visitante.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.event || !body.user_id || !body.session_id || !body.page) {
      return NextResponse.json({ ok: false, error: 'missing required fields' }, { status: 400 });
    }

    const payload: Record<string, unknown> = { source: SITE };
    for (const key of FIELDS) {
      if (body[key] !== undefined && body[key] !== null && body[key] !== '') payload[key] = body[key];
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? '';
    const ua = req.headers.get('user-agent') ?? '';

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-analytics-key': process.env.SERVICEDESK_ANALYTICS_KEY ?? '',
        'x-visitor-ip': ip,
        'x-visitor-ua': ua,
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ ok: response.ok });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
