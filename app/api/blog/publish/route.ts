import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-publish-token');

  if (!token || token !== process.env.BLOG_PUBLISH_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    date?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { title, slug, excerpt, content, coverImage, date } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'title, slug e content são obrigatórios' }, { status: 400 });
  }

  const safeSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const postDate = date || new Date().toISOString();

  const lines = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: "${postDate}"`,
    `excerpt: "${(excerpt || '').replace(/"/g, '\\"')}"`,
    coverImage ? `coverImage: "${coverImage}"` : null,
    '---',
    '',
    content,
  ].filter((l) => l !== null);

  const fileContent = lines.join('\n');
  const filename = `${safeSlug}.md`;
  const blogDir = path.join(process.cwd(), 'content', 'blog');

  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  const filePath = path.join(blogDir, filename);
  fs.writeFileSync(filePath, fileContent, 'utf8');

  return NextResponse.json({ success: true, slug: safeSlug });
}
