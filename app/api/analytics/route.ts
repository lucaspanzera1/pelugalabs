import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.event || !body.user_id || !body.session_id || !body.page) {
      return NextResponse.json({ ok: false, error: 'missing required fields' });
    }

    const payload = {
      event: body.event,
      user_id: body.user_id,
      session_id: body.session_id,
      page: body.page,
      title: body.title,
      referrer: body.referrer,
      language: body.language,
      screen: body.screen,
      timestamp: body.timestamp,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_content: body.utm_content,
      utm_term: body.utm_term,
      source: 'peluga.com.br',
    };

    const response = await fetch('https://servicedesk.peluga.com.br/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false });
    }

    return NextResponse.json({ ok: true });

  } catch {
    return NextResponse.json({ ok: false });
  }
}

