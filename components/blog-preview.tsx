import Link from "next/link";
import { getAllPosts } from "@/utils/blog";
import Spotlight from "@/components/spotlight";

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 4);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-white/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-white/50">
              <span className="inline-flex text-white text-sm font-semibold">
                Blog
              </span>
            </div>
            <h2
              className="animate-[custom-spring_1000ms_both] mb-4 text-3xl font-semibold tracking-tight text-white/95 md:text-4xl"
              data-aos="fade-up"
              data-aos-once="false"
            >
              Últimos artigos
            </h2>
            <p
              className="text-lg text-white/60"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-once="false"
            >
              Guias práticos sobre desenvolvimento de software, automação e inteligência artificial para empresas.
            </p>

          </div>

          {/* Posts */}
          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group/card relative h-full overflow-hidden rounded-2xl bg-white/10 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-white/60 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 group-hover:before:opacity-100 ${
                  index === 3 ? "lg:hidden" : ""
                }`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-once="false"
              >

                <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-[#172E6E] flex flex-col">
                  {/* Arrow */}
                  <div
                    className="absolute right-6 top-6 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/6 text-white/95 opacity-0 transition-opacity group-hover/card:opacity-100"
                    aria-hidden="true"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width={9} height={8} fill="none">
                      <path fill="#FFFFFF" d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z" />
                    </svg>
                  </div>

                  {/* Cover image */}
                  {post.coverImage && (
                    <div className="relative h-48 sm:h-56 overflow-hidden shrink-0 border-b border-white/20">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                      />
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 blur-3xl transition-opacity duration-500 group-hover/card:opacity-40" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#172E6E] via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  <div className="flex flex-col flex-grow p-6">
                    <header className="mb-4">
                      {post.date && (
                        <div className="mb-3">
                          <span className="btn-sm relative rounded-full bg-white/4 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-white/.3),--theme(--color-white/.7))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-white/6">
                            <span className="text-white font-medium">
                              {new Date(post.date).toLocaleDateString("pt-BR", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold font-nacelle mb-3 leading-tight text-white/95 transition-colors duration-300">
                        {post.title}
                      </h3>
                    </header>
                    <p className="text-white/60 flex-grow mb-6 line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </Spotlight>

          {/* CTA para o blog */}
          <div className="mt-12 text-center" data-aos="fade-up" data-aos-once="false">

            <Link
              href="/blog"
              className="btn group bg-white hover:bg-slate-100 text-[#172E6E] transition-colors"
            >
              Ver todos os artigos
              <span className="ml-1 tracking-normal text-[#172E6E]/60 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
