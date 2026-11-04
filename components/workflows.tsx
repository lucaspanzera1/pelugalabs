import Image from "next/image";
import WorflowImg01 from "@/public/images/workflow-01.png";
import WorflowImg02 from "@/public/images/workflow-02.png";
import WorflowImg03 from "@/public/images/workflow-03.png";
import Spotlight from "@/components/spotlight";

export default function Workflows() {
  return (
    <section id="services">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-white/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-white/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-white/50">
              <span className="inline-flex text-white font-semibold text-sm">
                Como trabalhamos
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-white),#c7d2fe,var(--color-white),#c7d2fe,var(--color-white))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Da ideia ao software em produção.
            </h2>
            <p className="text-lg text-white/60">
              Não entregamos só código. Entendemos o problema, construímos em ciclos curtos e seguimos evoluindo o software junto com a sua empresa.
            </p>
          </div>
          {/* Spotlight items */}
          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
            {/* Card 1 */}
            <div
              className="group/card relative h-full overflow-hidden rounded-2xl bg-white/10 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-white/60 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 group-hover:before:opacity-100"
              data-aos="fade-up"
              data-aos-once="false"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-[#172E6E] flex flex-col">
                {/* Image */}
                <div className="relative h-64 overflow-hidden shrink-0 border-b border-white/20">
                  <Image
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                    src={WorflowImg01}
                    fill
                    alt="Descoberta e planejamento do projeto de software"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 blur-3xl transition-opacity duration-500 group-hover/card:opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172E6E] via-transparent to-transparent opacity-60" />
                </div>
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="btn-sm relative rounded-full bg-white/4 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-white/.3),--theme(--color-white/.7))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-white/6">
                      <span className="text-white font-medium">
                        Descoberta &amp; Planejamento
                      </span>
                    </h3>
                  </div>
                  <p className="text-white/60">
                    Entendemos o processo, os usuários e os sistemas atuais e definimos escopo, prioridades e arquitetura. Sem achismo.
                  </p>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div
              className="group/card relative h-full overflow-hidden rounded-2xl bg-white/10 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-white/60 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 group-hover:before:opacity-100"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-once="false"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-[#172E6E] flex flex-col">
                {/* Image */}
                <div className="relative h-64 overflow-hidden shrink-0 border-b border-white/20">
                  <Image
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                    src={WorflowImg02}
                    fill
                    alt="Design e desenvolvimento do software"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 blur-3xl transition-opacity duration-500 group-hover/card:opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172E6E] via-transparent to-transparent opacity-60" />
                </div>
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="btn-sm relative rounded-full bg-white/4 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-white/.3),--theme(--color-white/.7))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-white/6">
                      <span className="text-white font-medium">
                        Design &amp; Desenvolvimento
                      </span>
                    </h3>
                  </div>
                  <p className="text-white/60">
                    Protótipos validados com você e entregas funcionais a cada ciclo, com testes, revisão de código e boas práticas.
                  </p>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div
              className="group/card relative h-full overflow-hidden rounded-2xl bg-white/10 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-white/60 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 group-hover:before:opacity-100"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-once="false"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-[#172E6E] flex flex-col">
                {/* Image */}
                <div className="relative h-64 overflow-hidden shrink-0 border-b border-white/20">
                  <Image
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                    src={WorflowImg03}
                    fill
                    alt="Lançamento e evolução contínua do software"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 blur-3xl transition-opacity duration-500 group-hover/card:opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172E6E] via-transparent to-transparent opacity-60" />
                </div>
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="btn-sm relative rounded-full bg-white/4 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-white/.3),--theme(--color-white/.7))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-white/6">
                      <span className="text-white font-medium">
                        Lançamento &amp; Evolução
                      </span>
                    </h3>
                  </div>
                  <p className="text-white/60">
                    Publicamos, monitoramos e seguimos evoluindo o software com novas funcionalidades e suporte com SLA.
                  </p>
                </div>
              </div>
            </div>
          </Spotlight>
        </div>
      </div>
    </section>
  );
}
