import Link from 'next/link';
import { getAllPosts } from '@/utils/blog';
import PageIllustration from '@/components/page-illustration';
import Spotlight from '@/components/spotlight';
import { DEFAULT_OG_IMAGE } from '@/content/seo';

export const metadata = {
  title: 'Blog sobre Desenvolvimento de Software',
  description: 'Artigos sobre desenvolvimento de software, automação e inteligência artificial para empresas.',
  openGraph: {
    title: 'Blog de Desenvolvimento de Software | Peluga Labs',
    description: 'Artigos e guias práticos sobre desenvolvimento de software, automação e inteligência artificial para empresas.',
    url: 'https://labs.peluga.com.br/blog',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: 'https://labs.peluga.com.br/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog de Desenvolvimento de Software | Peluga Labs',
    description: 'Artigos e guias práticos sobre desenvolvimento de software, automação e inteligência artificial para empresas.',
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageIllustration />
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="pb-12 pt-32 md:pb-20 md:pt-40">
            {/* Context/Hero block */}
            <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
              <h1 className="animate-[custom-spring_1000ms_both] mb-4 text-4xl font-semibold tracking-tight text-white md:text-5xl" data-aos="fade-up">
                Blog de Desenvolvimento de Software
              </h1>
              <p className="animate-[custom-spring_1000ms_both_100ms] text-lg text-white/75" data-aos="fade-up" data-aos-delay="100">
                Artigos e guias práticos sobre desenvolvimento de software, automação e inteligência artificial para empresas.
              </p>
            </div>

            {/* Blog Post List */}
            <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group/card relative h-full overflow-hidden rounded-2xl bg-white/10 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-white/60 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 group-hover:before:opacity-100"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-[#172E6E] flex flex-col">
                    {/* Arrow */}
                    <div
                      className="absolute right-6 top-6 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/6 text-white/95 opacity-0 transition-opacity group-hover/card:opacity-100"
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={9}
                        height={8}
                        fill="none"
                      >
                        <path
                          fill="#FFFFFF"
                          d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"
                        />
                      </svg>
                    </div>

                    {/* Imagem do Post se houver */}
                    {post.coverImage && (
                      <div className="relative h-48 sm:h-56 overflow-hidden shrink-0 border-b border-white/20">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                        />
                        {/* Glow no hover, contido pelo overflow-hidden da imagem */}
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 blur-3xl transition-opacity duration-500 group-hover/card:opacity-40" />
                        {/* Gradiente sutil para criar transição suave até o fundo */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#172E6E] via-transparent to-transparent opacity-60" />
                      </div>
                    )}

                    <div className="flex flex-col flex-grow p-6">
                      <header className="mb-4">
                        {post.date && !isNaN(new Date(post.date).getTime()) && (
                          <div className="mb-3">
                            <span className="btn-sm relative rounded-full bg-white/4 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-white/.3),--theme(--color-white/.7))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-white/6">
                              <span className="text-white font-medium">
                                {new Date(post.date).toLocaleDateString('pt-BR', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </span>
                          </div>
                        )}
                        <h2 className="text-xl md:text-2xl font-bold font-nacelle mb-3 leading-tight text-white/95 transition-colors duration-300">
                          {post.title}
                        </h2>
                      </header>

                      <p className="text-white/60 flex-grow mb-6 line-clamp-3 text-sm md:text-base leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {posts.length === 0 && (
                <div className="col-span-full py-12 text-center text-white/60">
                  Nenhum post encontrado. Adicione arquivos .md na pasta content/blog.
                </div>
              )}
            </Spotlight>
          </div>
        </div>
      </section>
    </>
  );
}
