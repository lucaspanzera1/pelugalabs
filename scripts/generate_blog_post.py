import os
import argparse
import json
import re
import sys
from datetime import datetime, timezone
from groq import Groq

client = Groq(api_key=os.environ["GROQ_API_KEY"])

BLOG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "content", "blog")
IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "images", "blog")


def stream_to_string(completion) -> str:
    result = ""
    for chunk in completion:
        delta = chunk.choices[0].delta
        result += delta.content or ""
    return result


def extract_json(text: str) -> dict:
    """Extract JSON from text that may be wrapped in markdown code blocks."""
    text = text.strip()
    # Remove markdown code fences
    for fence in ["```json", "```"]:
        if fence in text:
            text = text.split(fence)[1].split("```")[0].strip()
            break
    # Find first { ... } block in case there is extra text
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        text = match.group(0)
    return json.loads(text)


def get_requested_theme() -> str:
    """Read optional blog theme from CLI (--theme) or BLOG_THEME environment variable."""
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--theme", type=str, default="")
    args, _ = parser.parse_known_args()

    cli_theme = (args.theme or "").strip()
    env_theme = os.environ.get("BLOG_THEME", "").strip()
    return cli_theme or env_theme


# ---------------------------------------------------------------------------
# Step 1 — Research relevant tech topics for the week
# ---------------------------------------------------------------------------
def research_topics() -> list[dict]:
    print("→ Pesquisando temas relevantes da semana...")

    now_str = datetime.now().strftime("%d de %B de %Y")

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": (
                    f"Hoje é {now_str}. Liste 5 temas de desenvolvimento de software "
                    "altamente relevantes desta semana para gestores e donos de empresas no Brasil. "
                    "Foque em: sistemas sob medida, aplicativos mobile, sites e SEO técnico, e-commerce, "
                    "integração de sistemas e APIs, automação de processos, inteligência artificial aplicada a empresas, "
                    "manutenção e modernização de sistemas legados. Prefira temas com intenção de busca real "
                    "(dúvidas que empresas pesquisam no Google, como 'quanto custa desenvolver um sistema').\n\n"
                    "Retorne APENAS um JSON array. Exemplo de formato:\n"
                    '[{"topic": "Nome do tema", "relevance": "Por que é relevante agora"}]\n'
                    "Sem texto extra, só o JSON."
                ),
            }
        ],
        temperature=0.7,
        max_completion_tokens=1024,
        top_p=1,
        reasoning_effort="medium",
        stream=True,
        stop=None,
    )

    raw = stream_to_string(completion)
    print(f"  Resposta bruta (temas): {raw[:200]}...")

    # The model may return a JSON array directly or wrapped in an object
    raw = raw.strip()
    for fence in ["```json", "```"]:
        if fence in raw:
            raw = raw.split(fence)[1].split("```")[0].strip()
            break

    topics = json.loads(raw)
    # Handle if model returned {"topics": [...]} instead of [...]
    if isinstance(topics, dict):
        topics = next(iter(topics.values()))

    print(f"  {len(topics)} temas encontrados.")
    return topics


# ---------------------------------------------------------------------------
# Step 2 — Get article metadata (title, excerpt, slug) as a small JSON
# ---------------------------------------------------------------------------
def get_metadata(topics: list[dict]) -> dict:
    print("→ Selecionando tema e gerando metadados...")

    topics_text = "\n".join([f"- {t['topic']}: {t['relevance']}" for t in topics])

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": (
                    f"Temas da semana:\n{topics_text}\n\n"
                    "Escolha o tema mais relevante e gere os metadados do artigo em PT-BR.\n"
                    "Foque em desenvolvimento de software e em problemas reais de empresas.\n"
                    "O título deve conter a palavra-chave principal do tema.\n"
                    "Não use abreviações de negócio (como PME); siglas técnicas consagradas (API, ERP, CRM, SEO, IA) são permitidas.\n"
                    "Retorne APENAS este JSON (sem texto extra):\n"
                    '{"title": "Título do artigo em PT-BR", '
                    '"excerpt": "Uma frase de impacto em PT-BR", '
                    '"slug": "url-friendly-slug-in-english", '
                    '"topic": "tema escolhido em PT-BR"}'
                ),
            }
        ],
        temperature=0.7,
        max_completion_tokens=512,
        top_p=1,
        reasoning_effort="medium",
        stream=True,
        stop=None,
    )

    raw = stream_to_string(completion)
    print(f"  Resposta bruta (metadados): {raw[:300]}")
    return extract_json(raw)


def get_metadata_from_manual_theme(theme: str) -> dict:
    print(f"→ Usando tema manual: {theme}")

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": (
                    f"Tema obrigatório do artigo: {theme}\n\n"
                    "Gere os metadados do artigo em PT-BR com foco em desenvolvimento de software. "
                    "O título deve conter a palavra-chave principal do tema. "
                    "Não use abreviações de negócio (como PME); siglas técnicas consagradas (API, ERP, CRM, SEO, IA) são permitidas.\n"
                    "Retorne APENAS este JSON (sem texto extra):\n"
                    '{"title": "Título do artigo em PT-BR", '
                    '"excerpt": "Uma frase de impacto em PT-BR", '
                    '"slug": "url-friendly-slug-in-english", '
                    '"topic": "tema escolhido em PT-BR"}'
                ),
            }
        ],
        temperature=0.7,
        max_completion_tokens=512,
        top_p=1,
        reasoning_effort="medium",
        stream=True,
        stop=None,
    )

    raw = stream_to_string(completion)
    print(f"  Resposta bruta (metadados tema manual): {raw[:300]}")
    metadata = extract_json(raw)

    if not metadata.get("topic"):
        metadata["topic"] = theme

    return metadata


# ---------------------------------------------------------------------------
# Step 3 — Write the full article as plain markdown (no JSON wrapping)
# ---------------------------------------------------------------------------
def write_article_content(metadata: dict) -> str:
    print(f"→ Escrevendo artigo: {metadata['title']}...")

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": (
                    "Você é um redator sênior da Peluga Labs, empresa de Belo Horizonte especializada em "
                    "desenvolvimento de software sob medida: sistemas web, aplicativos mobile, sites, "
                    "e-commerce, integrações e APIs, automação e inteligência artificial. "
                    "Seu objetivo é explicar problemas e soluções de software de forma clara para gestores, "
                    "com profundidade técnica suficiente para ser útil a profissionais de tecnologia. "
                    "Escreve em Português Brasileiro (PT-BR). Tom profissional mas acessível. "
                    "Não use abreviações de negócio (como PME); siglas técnicas consagradas (API, ERP, CRM, SEO, IA) "
                    "são permitidas, explicadas na primeira menção."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Escreva um artigo completo em PT-BR sobre: {metadata['topic']}\n\n"
                    f"Título: {metadata['title']}\n\n"
                    "O artigo deve:\n"
                    "- Ter no mínimo 1000 palavras\n"
                    "- Focar em desenvolvimento de software e em problemas reais de empresas\n"
                    "- Usar a palavra-chave principal no primeiro parágrafo e em pelo menos um subtítulo ##\n"
                    "- Referenciar a Peluga Labs (Belo Horizonte) como especialista em desenvolvimento de software\n"
                    "- Não usar abreviações de negócio; explicar siglas técnicas na primeira menção\n"
                    "- Ter seções práticas com exemplos reais (lojas, clínicas, indústrias, distribuidoras, empresas de serviços)\n"
                    "- Terminar com uma seção ## Perguntas frequentes com 3 perguntas e respostas curtas\n"
                    "- Usar markdown: ## para seções, ### para subseções, **negrito**, listas, > blockquotes\n"
                    "- Dar insights concretos e acionáveis\n\n"
                    "Retorne APENAS o conteúdo markdown do artigo, começando direto com o # título. "
                    "Sem frontmatter, sem blocos de código envolvendo o artigo."
                ),
            },
        ],
        temperature=1,
        max_completion_tokens=6000,
        top_p=1,
        reasoning_effort="medium",
        stream=True,
        stop=None,
    )

    content = stream_to_string(completion).strip()
    
    # Append the mandatory CTA
    cta = (
        "\n\n---\n\n"
        "**[Solicite uma demonstração gratuita com a Peluga Labs](https://wa.me/5531991826043?text=Ol%C3%A1%2C%20quero%20uma%20demonstra%C3%A7%C3%A3o%20de%20IA%20generativa)** | "
        "**[Fale com um especialista da Peluga Labs](https://wa.me/5531991826043)** | "
        "**Telefone: (31) 99182-6043**\n"
    )
    content += cta
    
    print(f"  Artigo gerado ({len(content)} caracteres).")
    return content


# ---------------------------------------------------------------------------
# Step 4 — Generate a cover image with Google Gemini (Imagen 3)
# ---------------------------------------------------------------------------
def fetch_cover_image(topic: str, slug: str) -> str:
    """Generate a cover image with Imagen 3 and save it locally. Returns the public path."""
    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    if not gemini_key:
        print("  ⚠ GEMINI_API_KEY não configurado, usando imagem padrão.")
        return "/images/workflow-02.png"

    print(f"→ Gerando imagem para: {topic}...")

    try:
        from google import genai as google_genai
        from google.genai import types as google_types

        google_client = google_genai.Client(api_key=gemini_key)
        response = google_client.models.generate_content(
            model="gemini-3.1-flash-image-preview",
            contents=(
                f"Generate a professional blog cover image about: {topic}. "
                "Modern, clean, corporate style related to software development "
                "(code editors, app interfaces, dashboards, developers collaborating), suitable for a blog cover image, "
                "no text, no logos."
            ),
            config=google_types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )

        image_bytes = None
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image_bytes = part.inline_data.data
                break

        if not image_bytes:
            raise ValueError("Nenhuma imagem retornada pelo modelo.")

        os.makedirs(IMAGES_DIR, exist_ok=True)
        filename = f"{slug}.jpg"
        filepath = os.path.join(IMAGES_DIR, filename)

        with open(filepath, "wb") as f:
            f.write(image_bytes)

        print(f"  Imagem gerada e salva: {filepath}")
        return f"/images/blog/{filename}"
    except Exception as e:
        print(f"  ⚠ Erro ao gerar imagem: {e}. Usando imagem padrão.")
        return "/images/workflow-02.png"


# ---------------------------------------------------------------------------
# Step 5 — Save .md file with frontmatter
# ---------------------------------------------------------------------------
def save_article(metadata: dict, content: str, cover_image: str) -> str:
    now = datetime.now(timezone.utc)
    date_iso = now.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    date_prefix = now.strftime("%Y-%m-%d")

    slug = re.sub(r"[^a-z0-9-]", "", metadata["slug"].lower().replace(" ", "-"))
    filename = f"{date_prefix}-{slug}.md"
    filepath = os.path.join(BLOG_DIR, filename)

    title = metadata["title"].replace('"', '\\"')
    excerpt = metadata["excerpt"].replace('"', '\\"')

    frontmatter = (
        f'---\n'
        f'title: "{title}"\n'
        f'date: "{date_iso}"\n'
        f'excerpt: "{excerpt}"\n'
        f'coverImage: "{cover_image}"\n'
        f'---\n\n'
        f'{content}\n'
    )

    os.makedirs(BLOG_DIR, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(frontmatter)

    print(f"  Arquivo salvo: {filepath}")
    return filepath


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    try:
        requested_theme = get_requested_theme()
        if requested_theme:
            metadata = get_metadata_from_manual_theme(requested_theme)
        else:
            topics = research_topics()
            metadata = get_metadata(topics)

        slug = re.sub(r"[^a-z0-9-]", "", metadata["slug"].lower().replace(" ", "-"))
        cover_image = fetch_cover_image(metadata["topic"], slug)
        content = write_article_content(metadata)
        filepath = save_article(metadata, content, cover_image)
        print(f"\n✓ Post gerado com sucesso: {os.path.basename(filepath)}")
    except Exception as e:
        print(f"\n✗ Erro: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)