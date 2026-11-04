import { NextRequest, NextResponse } from 'next/server';

// Whitelist of supported upstream health endpoints
const WHITELIST: Record<string, string> = {
  novoden0v0: 'https://www.novoden0v0.com.br/api/health',
  treinavaga: 'https://api.treinavaga.tech/api/',
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get('key') ?? 'novoden0v0';
    const target = WHITELIST[key];

    if (!target) {
      return NextResponse.json({ error: 'Unknown target key' }, { status: 400 });
    }

    const res = await fetch(target, { next: { revalidate: 0 } });
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : 502 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch upstream', details: String(err) }, { status: 502 });
  }
}
