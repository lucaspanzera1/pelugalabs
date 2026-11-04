import React from 'react';
import { getPostBySlug, getPostSlugs } from '@/utils/blog';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageIllustration from '@/components/page-illustration';
import SharePost from '@/components/share-post';
import MarkdownImage from '@/components/markdown-image';
import { DEFAULT_OG_IMAGE } from '@/content/seo';
import WhatsAppButton from '@/components/whatsapp-button';

// Divide o artigo no subtítulo (##) mais próximo do meio, para inserir um CTA
// no ponto em que boa parte dos leitores ainda não abandonou a leitura.
function splitAtMiddleHeading(content: string): [string, string] | null {
  const headings: number[] = [];
  let inCode = false;
  let offset = 0;
  for (const line of content.split('\n')) {
    if (line.startsWith('```')) inCode = !inCode;
    if (!inCode && /^## /.test(line)) headings.push(offset);
    offset += line.length + 1;
  }
  if (headings.length < 3) return null;
  const middle = content.length / 2;
  const candidates = headings.slice(1, -1);
  const cut = candidates.reduce((best, h) => (Math.abs(h - middle) < Math.abs(best - middle) ? h : best));
  return [content.slice(0, cut), content.slice(cut)];
}

function InlineCta() {
  return (
    <aside className="not-prose my-12 rounded-2xl border border-white/20 bg-white/5 p-6 md:p-8">
      <p className="font-nacelle text-xl font-semibold text-white">
        Quer saber como isso se aplica à sua empresa?
      </p>
      <p className="mt-2 text-white/75">
        No diagnóstico gratuito, entendemos o seu processo e você sai com escopo, etapas e estimativa de prazo e investimento. Sem compromisso.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href="/budget"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#172E6E] transition-colors hover:bg-slate-100"
        >
          Quero meu diagnóstico gratuito <span aria-hidden="true">→</span>
        </a>
        <a
          href="https://api.whatsapp.com/send/?phone=5531991826043&text=Ol%C3%A1%21+Li+um+artigo+no+blog+e+quero+conversar+sobre+um+projeto+de+software."
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-white/95 underline-offset-4 hover:text-white hover:underline"
        >
          ou chame no WhatsApp
        </a>
      </div>
    </aside>
  );
}

function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        img: ({ node, ...props }) => <MarkdownImage {...props} />,
        p: ({ children }) => {
          const hasImg = React.Children.toArray(children).some((child: any) => 
            child?.type === 'img' || 
            child?.props?.src || 
            (child?.type?.name && child.type.name.includes('Image'))
          );
          if (hasImg) return <>{children}</>;
          return <p>{children}</p>;
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    ...(post.archived && { robots: { index: false, follow: true } }),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://labs.peluga.com.br/blog/${resolvedParams.slug}`,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : [DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical: `https://labs.peluga.com.br/blog/${resolvedParams.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage || DEFAULT_OG_IMAGE.url],
    },
  };
}

export function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ''),
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    const post = getPostBySlug(resolvedParams.slug);

    if (!post) {
      return notFound();
    }

    const baseUrl = "https://labs.peluga.com.br";
    const coverImageUrl = post.coverImage
      ? post.coverImage.startsWith("http")
        ? post.coverImage
        : `${baseUrl}${post.coverImage}`
      : `${baseUrl}/opengraph-image`;

    // Safe date formatting
    let formattedDate = '';
    if (post.date) {
      try {
        const dateObj = new Date(post.date);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          });
        }
      } catch (e) {
        console.error('Error formatting date:', e);
      }
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: coverImageUrl,
      datePublished: post.date,
      dateModified: post.date,
      url: `${baseUrl}/blog/${resolvedParams.slug}`,
      author: {
        "@type": "Organization",
        name: "Peluga Labs",
        url: baseUrl,
      },
      publisher: {
        "@type": "Organization",
        name: "Peluga Labs",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/images/logo.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}/blog/${resolvedParams.slug}`,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PageIllustration />
        <section className="relative">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="pb-12 pt-32 md:pb-20 md:pt-40">
              {/* Context/Hero block */}
              <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
                {formattedDate && (
                  <div className="mb-4 flex items-center justify-center space-x-3 text-sm font-medium text-white/75">
                    <span>{formattedDate}</span>
                    <span className="text-white/60">•</span>
                    <SharePost compact={true} title={post.title} />
                  </div>
                )}
                <h1 className="animate-[custom-spring_1000ms_both] mb-6 text-4xl font-semibold tracking-tight text-white/95 md:text-5xl lg:text-6xl" data-aos="fade-up">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="animate-[custom-spring_1000ms_both_100ms] text-lg text-white/75" data-aos="fade-up" data-aos-delay="100">
                    {post.excerpt}
                  </p>
                )}
              </div>

              {post.coverImage && (
                <div className="mb-12">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-auto rounded-3xl object-cover shadow-2xl mt-8"
                  />
                </div>
              )}

              {/* Markdown Content Block */}
              <div className="mx-auto max-w-3xl text-white/85">
                <article className="prose prose-lg prose-invert max-w-none prose-a:text-white/95 hover:prose-a:text-white prose-headings:font-nacelle prose-headings:text-white prose-strong:text-white prose-blockquote:text-white/85 prose-blockquote:border-white/30">
                  {(() => {
                    const parts = splitAtMiddleHeading(post.content);
                    if (!parts) return <Markdown content={post.content} />;
                    return (
                      <>
                        <Markdown content={parts[0]} />
                        <InlineCta />
                        <Markdown content={parts[1]} />
                      </>
                    );
                  })()}
                </article>

                {/* Share component */}
                <SharePost title={post.title} />
              </div>
            </div>
          </div>
        </section>
        <WhatsAppButton />
      </>
    );
  } catch (e) {
    return notFound();
  }
}
