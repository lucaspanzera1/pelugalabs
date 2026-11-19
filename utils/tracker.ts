/**
 * Peluga Tracker — analytics de primeira mão → servicedesk.
 *
 * CÓPIA IDÊNTICA em peluga.com.br (utils/tracker.ts), pelugalabs (utils/tracker.ts)
 * e giro (src/lib/tracker.ts). Alterou num, copie para os outros.
 *
 * Captura automaticamente:
 *  - page_view (com tempo de carregamento, tipo de navegação, fuso)
 *  - TODO clique: elemento, texto, rótulo (data-track), seletor, seção, link,
 *    posição na página (x/y + tamanho da janela/documento → mapa de calor).
 *    WhatsApp, e-mail, telefone, Instagram, links externos e data-track ganham
 *    nome próprio (whatsapp_click, cta_click...); o resto é "click".
 *  - rage_click (3+ cliques rápidos no mesmo ponto = frustração)
 *  - scroll_depth (25/50/75/90/100%)
 *  - section_view (section[id] / [data-section] visível por 1s)
 *  - form_start / form_submit / form_abandon (nomes dos campos, NUNCA valores)
 *  - page_leave (tempo visível, tempo ativo, scroll máximo)
 *  - js_error, copy
 *
 * Privacidade: nada digitado é capturado. Use data-no-track num elemento para
 * ignorar cliques nele e nos filhos. Não roda em iframe nem para quem abriu o
 * site com ?notrack=1 (equipe — vale para o navegador; ?notrack=0 desfaz).
 *
 * Os eventos vão para uma fila e são enviados em lote para /api/analytics
 * (proxy server-side do próprio site, que adiciona IP/UA/geo e a chave).
 */

type Value = string | number | boolean | undefined | null;
export type Props = Record<string, Value>;

const USER_COOKIE = "peluga_uid";
const SESSION_COOKIE = "peluga_sid";
const UTM_KEY = "peluga_utm";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const SCROLL_MARKS = [25, 50, 75, 90, 100];
const FLUSH_MS = 3000;
const MAX_QUEUE = 25;
const MAX_ERRORS_PER_PAGE = 5;
const ACTIVE_WINDOW_MS = 15000;

let endpoint = "/api/analytics";
let enabled = false;
let installed = false;
const context: Props = {};
/** O primeiro page view (carga real da página) leva referrer e tempo de carregamento */
let installedPageViewSent = false;

// ── Identidade ────────────────────────────────────────────────────────────

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // Fallback no formato UUID v4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getVisitorId(): string {
  let uid = getCookie(USER_COOKIE);
  if (!uid) {
    uid = newId();
    setCookie(USER_COOKIE, uid, 365 * 24 * 60 * 60);
  }
  return uid;
}

/** Sessão = 30 min de inatividade (renovada a cada evento) */
export function getSessionId(): string {
  const sid = getCookie(SESSION_COOKIE) ?? newId();
  setCookie(SESSION_COOKIE, sid, 30 * 60);
  return sid;
}

/** UTMs da URL atual; se não houver, os da sessão (navegação interna perde a query) */
function utmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Record<string, string> = {};
  for (const key of UTM_FIELDS) {
    const v = params.get(key);
    if (v) fromUrl[key] = v.slice(0, 100);
  }
  try {
    if (Object.keys(fromUrl).length) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    return JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}");
  } catch {
    return fromUrl;
  }
}

// ── Fila e envio ──────────────────────────────────────────────────────────

let queue: Record<string, unknown>[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function post(events: Record<string, unknown>[]) {
  // keepalive: chega mesmo saindo da página (limite ~64KB por requisição)
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events }),
    keepalive: true,
  }).catch(() => {});
}

export function flush() {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = null;
  while (queue.length) post(queue.splice(0, MAX_QUEUE));
}

function clean(props: Props): Record<string, string | number | boolean> | undefined {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === "") continue;
    out[k] = typeof v === "string" ? v.slice(0, 300) : typeof v === "number" ? Math.round(v * 100) / 100 : v;
  }
  return Object.keys(out).length ? out : undefined;
}

function enqueue(event: string, props: Props = {}, extra: Record<string, unknown> = {}) {
  if (!enabled) return;
  try {
    queue.push({
      event,
      user_id: getVisitorId(),
      session_id: getSessionId(),
      page: page.path,
      title: document.title?.slice(0, 255) || undefined,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`,
      timestamp: new Date().toISOString(),
      ...utmParams(),
      ...extra,
      properties: clean({ ...context, pv: page.id, ...props }),
    });
    if (queue.length >= MAX_QUEUE) flush();
    else if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_MS);
  } catch {
    /* analytics nunca quebra a página */
  }
}

/** Evento customizado: track("video_play", { id: "demo" }) */
export function track(event: string, props: Props = {}) {
  if (event === "lead_submit") page.forms.forEach((f) => (f.submitted = true));
  enqueue(event, props);
}

/** Propriedades fixas anexadas a todos os eventos (ex: variante de teste A/B) */
export function setContext(values: Props) {
  for (const [k, v] of Object.entries(values)) if (v !== undefined && v !== "") context[k] = v;
}

// ── Estado da página atual ────────────────────────────────────────────────

interface FormState {
  name: string;
  fields: Set<string>;
  lastField?: string;
  submitted: boolean;
  abandonSent: boolean;
}

const page = {
  id: "",
  path: "/",
  started: 0,
  visibleMs: 0,
  visibleSince: 0 as number | null,
  activeMs: 0,
  lastActivity: 0,
  maxScroll: 0,
  marks: new Set<number>(),
  sections: new Set<string>(),
  forms: new Map<Element, FormState>(),
  errors: 0,
};

function resetPage(path: string) {
  const now = Date.now();
  page.id = newId();
  page.path = path;
  page.started = now;
  page.visibleMs = 0;
  page.visibleSince = document.visibilityState === "visible" ? now : null;
  page.activeMs = 0;
  page.lastActivity = now;
  page.maxScroll = scrollPercent();
  page.marks = new Set();
  page.sections = new Set();
  page.forms = new Map();
  page.errors = 0;
}

function visibleMs(): number {
  return page.visibleMs + (page.visibleSince ? Date.now() - page.visibleSince : 0);
}

/** Resumo da página (valores acumulados — o servidor fica com o maior por pv) */
function sendLeave(final: boolean) {
  if (!page.id) return;
  enqueue("page_leave", {
    duration: visibleMs(),
    engaged: page.activeMs,
    scroll: Math.round(page.maxScroll),
    final,
  });
  if (final) {
    page.forms.forEach((f) => {
      if (f.submitted || f.abandonSent || !f.fields.size) return;
      f.abandonSent = true;
      enqueue("form_abandon", { form: f.name, fields: f.fields.size, last_field: f.lastField });
    });
  }
}

/** Registra a visualização de uma página (chame a cada troca de rota em SPA) */
export function trackPageView(path: string = window.location.pathname, props: Props = {}) {
  if (!enabled) return;
  if (page.id) sendLeave(true);
  resetPage(path);

  let loadMs: number | undefined;
  let navType: string | undefined;
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav && !installedPageViewSent) {
      loadMs = Math.round(nav.domContentLoadedEventEnd || nav.responseEnd);
      navType = nav.type;
    }
  } catch {
    /* sem Navigation Timing */
  }
  const first = !installedPageViewSent;
  installedPageViewSent = true;

  enqueue(
    "page_view",
    {
      vw: window.innerWidth,
      vh: window.innerHeight,
      load_ms: loadMs,
      nav: first ? navType : "spa",
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...props,
    },
    { referrer: first ? document.referrer || undefined : undefined },
  );
  // Seções só existem depois que a rota renderiza
  setTimeout(observeSections, 600);
  setTimeout(observeSections, 2500);
}

// ── Cliques ───────────────────────────────────────────────────────────────

const INTERACTIVE = "a, button, [role=button], [role=link], [role=tab], [role=menuitem], input, select, textarea, label, summary, [data-track], [onclick]";

function textOf(el: Element): string | undefined {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    // Nunca o valor digitado — só como o campo se apresenta
    const input = el as HTMLInputElement;
    const label = input.labels?.[0]?.textContent;
    return (
      el.getAttribute("aria-label") ||
      label ||
      input.placeholder ||
      el.getAttribute("name") ||
      (input.type === "submit" || input.type === "button" ? input.value : undefined) ||
      undefined
    )?.replace(/\s+/g, " ").trim().slice(0, 80);
  }
  const text = (el as HTMLElement).innerText ?? el.textContent ?? "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean) return clean.slice(0, 80);
  return (
    el.getAttribute("aria-label") ||
    el.getAttribute("title") ||
    el.querySelector("img[alt]")?.getAttribute("alt") ||
    undefined
  )?.slice(0, 80);
}

/**
 * Classes que identificam o elemento. Fora: utilitárias com número (px-4, min-h-12),
 * valores arbitrários do Tailwind, CSS modules e estados (is-visible, active...).
 */
function usefulClass(c: string): boolean {
  if (c.length >= 30 || /\d|[[\]:/@()!]|__/.test(c)) return false;
  if (/^(is|has|js)-|^(active|open|show|visible|hidden|selected|disabled|group|peer)$/.test(c)) return false;
  return !/^(flex|grid|block|inline|hidden|p[xytrbl]?-|m[xytrbl]?-|w-|h-|min-|max-|text-|bg-|border|rounded|gap-|items-|justify-|self-|place-|font-|leading-|tracking-|shadow|transition|duration-|ease-|hover|focus|z-|top-|left-|right-|bottom-|inset|absolute|relative|fixed|sticky|overflow|opacity-|cursor-|underline|decoration-|sr-only|shrink|grow|order-|col-|row-|space-|divide-|ring|outline|select-|pointer-|whitespace-|truncate|uppercase|lowercase|capitalize|italic|antialiased|aspect-|object-|backdrop|blur|scale-|rotate-|translate-|origin-|animate-)/.test(c);
}

function selectorOf(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  for (let depth = 0; node && node !== document.body && depth < 4; depth++) {
    let part = node.tagName.toLowerCase();
    if (node.id && !/\d{3,}|:/.test(node.id)) {
      parts.unshift(`${part}#${node.id}`);
      break;
    }
    const classes = Array.from(node.classList).filter(usefulClass).slice(0, 2);
    if (classes.length) part += "." + classes.join(".");
    parts.unshift(part);
    node = node.parentElement;
  }
  return parts.join(" > ").slice(0, 200);
}

function sectionOf(el: Element): string | undefined {
  // Começa no pai: um input com id não é uma "seção"
  const start = el.matches("section[id], [data-section]") ? el : el.parentElement ?? el;
  const s = start.closest("[data-section], section[id], header, footer, nav, aside, dialog, [role=dialog]");
  if (!s) return undefined;
  return s.getAttribute("data-section") || s.id || s.tagName.toLowerCase();
}

function classifyLink(a: HTMLAnchorElement): { event: string; kind: string; target?: string } {
  const href = a.getAttribute("href") ?? "";
  if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) return { event: "whatsapp_click", kind: "whatsapp", target: "whatsapp" };
  if (href.startsWith("mailto:")) return { event: "email_click", kind: "email", target: href.slice(7).split("?")[0] };
  if (href.startsWith("tel:")) return { event: "phone_click", kind: "phone", target: href.slice(4) };
  if (/instagram\.com/i.test(href)) return { event: "instagram_click", kind: "instagram", target: "instagram" };
  if (href.startsWith("#")) return { event: "click", kind: "anchor", target: href };
  try {
    const url = new URL(a.href, window.location.href);
    if (/^https?:$/.test(url.protocol) && url.hostname.replace(/^www\./, "") !== location.hostname.replace(/^www\./, "")) {
      return { event: "outbound_click", kind: "outbound", target: url.hostname };
    }
    if (a.hasAttribute("download") || /\.(pdf|zip|docx?|xlsx?|pptx?|csv)$/i.test(url.pathname)) {
      return { event: "download_click", kind: "download", target: url.pathname };
    }
    return { event: "click", kind: "link", target: url.pathname + url.hash };
  } catch {
    return { event: "click", kind: "link" };
  }
}

const recentClicks: Array<{ t: number; x: number; y: number }> = [];
let lastRageAt = 0;

function onClick(e: MouseEvent) {
  try {
    const raw = e.target as Element | null;
    if (!raw || !(raw instanceof Element) || raw.closest("[data-no-track]")) return;
    const el = raw.closest(INTERACTIVE) ?? raw;
    const tracked = raw.closest("[data-track]");

    let event = "click";
    let kind: string;
    let target: string | undefined;
    const tag = el.tagName.toLowerCase();
    if (el instanceof HTMLAnchorElement && el.getAttribute("href")) {
      ({ event, kind, target } = classifyLink(el));
    } else if (tag === "button" || el.getAttribute("role") === "button" || (el instanceof HTMLInputElement && /submit|button|reset/.test(el.type))) {
      kind = "button";
    } else if (tag === "input" || tag === "select" || tag === "textarea" || tag === "label") {
      kind = "field";
    } else if (el === raw && !raw.closest(INTERACTIVE)) {
      kind = "dead"; // clique em algo que não é clicável (texto, imagem...)
    } else {
      kind = "other";
    }
    if (tracked && event === "click") event = "cta_click";

    const hasPointer = !(e.detail === 0 && e.clientX === 0 && e.clientY === 0); // teclado
    const props: Props = {
      kind,
      tag,
      text: textOf(el),
      label: tracked?.getAttribute("data-track") || undefined,
      selector: selectorOf(el),
      section: sectionOf(el),
      href: el instanceof HTMLAnchorElement ? el.getAttribute("href")?.slice(0, 300) : undefined,
      target,
      x: hasPointer ? Math.round(e.pageX) : undefined,
      y: hasPointer ? Math.round(e.pageY) : undefined,
      vw: window.innerWidth,
      vh: window.innerHeight,
      dh: document.documentElement.scrollHeight,
    };
    enqueue(event, props);

    // Rage click: 3+ cliques em 1s num raio de 40px
    if (hasPointer) {
      const now = Date.now();
      recentClicks.push({ t: now, x: e.pageX, y: e.pageY });
      while (recentClicks.length && now - recentClicks[0].t > 1000) recentClicks.shift();
      const near = recentClicks.filter((c) => Math.hypot(c.x - e.pageX, c.y - e.pageY) < 40);
      if (near.length >= 3 && now - lastRageAt > 2000) {
        lastRageAt = now;
        enqueue("rage_click", { ...props, kind: undefined, count: near.length });
      }
    }

    // Link externo/WhatsApp tira o visitante da página: envia já
    if (event !== "click" && event !== "cta_click") flush();
  } catch {
    /* analytics nunca quebra a página */
  }
}

// ── Scroll, atividade, visibilidade ───────────────────────────────────────

function scrollPercent(): number {
  const doc = document.documentElement;
  const max = doc.scrollHeight;
  if (!max) return 0;
  return Math.min(100, ((window.scrollY + window.innerHeight) / max) * 100);
}

let scrollQueued = false;
function onScroll() {
  markActive();
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    scrollQueued = false;
    const pct = scrollPercent();
    if (pct > page.maxScroll) page.maxScroll = pct;
    // Página que nem rola não gera scroll_depth
    if (document.documentElement.scrollHeight <= window.innerHeight + 10) return;
    for (const mark of SCROLL_MARKS) {
      if (pct >= mark - 0.5 && !page.marks.has(mark)) {
        page.marks.add(mark);
        enqueue("scroll_depth", { depth: mark });
      }
    }
  });
}

function markActive() {
  page.lastActivity = Date.now();
}

function onVisibility() {
  if (document.visibilityState === "hidden") {
    if (page.visibleSince) {
      page.visibleMs += Date.now() - page.visibleSince;
      page.visibleSince = null;
    }
    sendLeave(false);
    flush();
  } else {
    page.visibleSince = Date.now();
    markActive();
  }
}

function onPageHide() {
  sendLeave(true);
  flush();
}

// ── Seções ────────────────────────────────────────────────────────────────

let observer: IntersectionObserver | null = null;
const sectionTimers = new Map<Element, ReturnType<typeof setTimeout>>();
const observed = new WeakSet<Element>();

function sectionName(el: Element): string {
  return el.getAttribute("data-section") || el.id;
}

function observeSections() {
  if (!("IntersectionObserver" in window)) return;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target;
          const visible = entry.intersectionRatio >= 0.5 || entry.intersectionRect.height >= window.innerHeight * 0.5;
          if (visible && !sectionTimers.has(el)) {
            sectionTimers.set(
              el,
              setTimeout(() => {
                sectionTimers.delete(el);
                const name = sectionName(el);
                if (!name || page.sections.has(name) || !el.isConnected) return;
                page.sections.add(name);
                const all = Array.from(document.querySelectorAll("section[id], [data-section]"));
                enqueue("section_view", { section: name, order: all.indexOf(el) + 1 });
              }, 1000),
            );
          } else if (!visible && sectionTimers.has(el)) {
            clearTimeout(sectionTimers.get(el));
            sectionTimers.delete(el);
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75] },
    );
  }
  document.querySelectorAll("section[id], [data-section]").forEach((el) => {
    if (observed.has(el)) return;
    observed.add(el);
    observer!.observe(el);
  });
}

// ── Formulários ───────────────────────────────────────────────────────────

function formName(form: Element): string {
  return (
    form.getAttribute("data-track") ||
    form.getAttribute("name") ||
    form.id ||
    form.getAttribute("aria-label") ||
    sectionOf(form) ||
    "form"
  ).slice(0, 60);
}

function formOf(el: Element): Element | null {
  return el.closest("form, [data-form]");
}

function onFocusIn(e: FocusEvent) {
  const el = e.target as Element | null;
  if (!el || !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) return;
  const form = formOf(el);
  if (!form) return;
  const field = (el.getAttribute("name") || el.id || el.getAttribute("aria-label") || el.type || "campo").slice(0, 40);
  let state = page.forms.get(form);
  if (!state) {
    state = { name: formName(form), fields: new Set(), submitted: false, abandonSent: false };
    page.forms.set(form, state);
    enqueue("form_start", { form: state.name, field });
  }
  state.fields.add(field);
  state.lastField = field;
}

function onSubmit(e: Event) {
  const form = e.target as Element | null;
  if (!form || !(form instanceof Element)) return;
  const state = page.forms.get(form);
  const name = state?.name ?? formName(form);
  if (state) state.submitted = true;
  enqueue("form_submit", { form: name, fields: state?.fields.size });
}

// ── Erros e cópia ─────────────────────────────────────────────────────────

function onError(e: ErrorEvent) {
  if (page.errors >= MAX_ERRORS_PER_PAGE) return;
  page.errors++;
  enqueue("js_error", {
    message: String(e.message || "erro").slice(0, 200),
    source: e.filename ? `${e.filename.split("/").pop()}:${e.lineno}` : undefined,
  });
}

function onRejection(e: PromiseRejectionEvent) {
  if (page.errors >= MAX_ERRORS_PER_PAGE) return;
  page.errors++;
  const reason = e.reason instanceof Error ? e.reason.message : String(e.reason);
  enqueue("js_error", { message: `promise: ${reason}`.slice(0, 200) });
}

function onCopy() {
  const text = window.getSelection()?.toString().replace(/\s+/g, " ").trim();
  if (!text) return;
  const anchor = window.getSelection()?.anchorNode;
  const el = anchor instanceof Element ? anchor : anchor?.parentElement;
  enqueue("copy", { text: text.slice(0, 60), length: text.length, section: el ? sectionOf(el) : undefined });
}

// ── Instalação ────────────────────────────────────────────────────────────

let activeTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Não rastreia:
 *  - dentro de iframe (ex: mapa de calor do servicedesk carregando a página)
 *  - quem abriu o site com ?notrack=1 uma vez (equipe); ?notrack=0 desfaz
 */
function optedOut(): boolean {
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true; // acesso ao top bloqueado = está em iframe de outro domínio
  }
  try {
    const flag = new URLSearchParams(location.search).get("notrack");
    if (flag === "1") localStorage.setItem("peluga_notrack", "1");
    if (flag === "0") localStorage.removeItem("peluga_notrack");
    return localStorage.getItem("peluga_notrack") === "1";
  } catch {
    return false;
  }
}

export interface TrackerOptions {
  /** Rota do proxy no próprio site (padrão /api/analytics) */
  endpoint?: string;
  /** Desliga em localhost (padrão: true) */
  skipLocalhost?: boolean;
}

/**
 * Liga o tracker (uma vez). Não registra page view — chame trackPageView()
 * em seguida (e a cada troca de rota, em SPA).
 */
export function initTracker(options: TrackerOptions = {}): () => void {
  if (typeof window === "undefined") return () => {};
  if (installed) return () => {};
  const local = /^(localhost|127\.|\[::1\]|0\.0\.0\.0)/.test(location.hostname);
  if (local && options.skipLocalhost !== false) return () => {};
  if (optedOut()) return () => {};
  installed = true;
  enabled = true;
  if (options.endpoint) endpoint = options.endpoint;

  const passive = { passive: true, capture: true } as const;
  const listeners: Array<[EventTarget, string, EventListener, AddEventListenerOptions | boolean]> = [
    [document, "click", onClick as EventListener, true],
    [document, "focusin", onFocusIn as EventListener, true],
    [document, "submit", onSubmit, true],
    [document, "copy", onCopy, true],
    [document, "visibilitychange", onVisibility, false],
    [window, "scroll", onScroll, passive],
    [window, "pagehide", onPageHide, false],
    [window, "error", onError as EventListener, false],
    [window, "unhandledrejection", onRejection as EventListener, false],
    ...(["mousemove", "keydown", "touchstart", "pointerdown"] as const).map(
      (type) => [document, type, markActive, passive] as [EventTarget, string, EventListener, AddEventListenerOptions],
    ),
  ];
  for (const [target, type, fn, opts] of listeners) target.addEventListener(type, fn, opts);

  // Tempo ativo: conta 1s a cada segundo com aba visível e interação recente
  activeTimer = setInterval(() => {
    if (document.visibilityState === "visible" && Date.now() - page.lastActivity < ACTIVE_WINDOW_MS) {
      page.activeMs += 1000;
    }
  }, 1000);

  return () => {
    for (const [target, type, fn, opts] of listeners) target.removeEventListener(type, fn, opts);
    if (activeTimer) clearInterval(activeTimer);
    observer?.disconnect();
    observer = null;
    flush();
    installed = false;
    enabled = false;
  };
}
