import Logo from "./logo";
import Link from "next/link";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=5531991826043&text=Ol%C3%A1%2C+vim+pelo+site+da+Peluga+Labs+e+quero+saber+mais+sobre+os+servi%C3%A7os!";

const links = [
  { name: "Soluções", href: "/#features" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "Orçamento", href: "/budget" },
  { name: "Portal de Clientes", href: "https://servicedesk.peluga.com.br", external: true },
];

const socials = [
  { name: "WhatsApp", href: WHATSAPP_URL },
  { name: "Instagram", href: "https://www.instagram.com/peluga.com.br/" },
  { name: "LinkedIn", href: "https://linkedin.com/company/peluga" },
];

const linkClass =
  "transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded-sm";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/20">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <p className="text-sm text-white/75">
              Software sob medida · Belo Horizonte
            </p>
          </div>

          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/75">
              {links.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {link.name}
                    </a>
                  ) : (
                    <Link href={link.href} className={linkClass}>
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-4 border-t border-white/20 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">© {new Date().getFullYear()} Peluga Labs</p>
          <ul className="flex gap-5">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
