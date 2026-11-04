import Image from "next/image";
import Link from "next/link";
import BlurredShapeGray from "@/public/images/blurred-shape-gray.svg";
import BlurredShape from "@/public/images/blurred-shape.svg";
import { solucoes } from "@/content/solucoes";

export default function Features() {
  return (
    <section className="relative" id="features">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShapeGray}
          width={760}
          height={668}
          alt=""
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt=""
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-white/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-white/50">
              <span className="inline-flex text-white font-semibold text-sm">
                Soluções em desenvolvimento de software
              </span>
            </div>
            <h2
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-white),#c7d2fe,var(--color-white),#c7d2fe,var(--color-white))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl"
              data-aos="fade-up"
              data-aos-once="false"
            >
              Software feito para o seu negócio.
            </h2>
            <p
              className="text-lg text-white/60"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-once="false"
            >
              De sistemas internos a aplicativos, de sites a integrações com IA: construímos o software que a sua operação precisa, do primeiro rascunho à evolução contínua.
            </p>
          </div>

          {/* Items */}
          <div className="mx-auto grid max-w-sm gap-12 sm:max-w-none sm:grid-cols-2 md:gap-x-14 md:gap-y-16 lg:grid-cols-3">
            {solucoes.filter((s) => s.slug !== "aplicativos-mobile").map((solucao, index) => (
              <Link
                key={solucao.slug}
                href={`/solucoes/${solucao.slug}`}
                className="group relative flex flex-col p-6 transition-all duration-300 hover:bg-[#172E6E] rounded-2xl border border-transparent hover:border-white/12"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-once="false"
              >

                <div className="mb-3 flex items-center justify-between">
                  <svg xmlns="http://www.w3.org/2000/svg" className="fill-white/85 transition-transform duration-300 group-hover:scale-110" height="24px" viewBox="0 -960 960 960" width="24px">
                    <path d={solucao.icon} />
                  </svg>
                  <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" className="fill-white/60">
                      <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-1 font-nacelle text-[1rem] font-semibold text-white/95 group-hover:text-white/60 transition-colors">
                  {solucao.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {solucao.description}
                </p>
                <div className="mt-auto flex items-center gap-2 text-xs font-medium text-white/75 group-hover:text-white/60 transition-colors">
                  <span>Saiba mais</span>
                  <span className="translate-x-0 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
