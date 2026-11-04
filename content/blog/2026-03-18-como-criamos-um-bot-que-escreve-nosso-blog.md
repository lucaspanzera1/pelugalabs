---
title: "Como Criamos um Bot que Escreve o Nosso Blog Toda Semana"
date: "2026-03-17T10:00:00.000Z"
excerpt: "Automatizamos a produção de conteúdo do nosso blog com IA — e o bot já está publicando sozinho toda segunda-feira."
coverImage: "/images/gitai.png"
---

# Como Criamos um Bot que Escreve o Nosso Blog Toda Semana

Toda segunda-feira de manhã, um artigo novo aparece no nosso blog. Ninguém escreve manualmente. Ninguém revisa antes de publicar. Um bot faz tudo — pesquisa o tema, escreve o artigo, escolhe a imagem e abre o pull request.

Esse post conta como chegamos até isso.

---

## O Problema que Queríamos Resolver

Manter um blog ativo é difícil. Todo mundo sabe que conteúdo consistente gera tráfego orgânico, constrói autoridade e aquece leads. Na prática, porém, o blog sempre fica para depois.

A agenda enche. As prioridades mudam. O artigo que "sai essa semana" vira o artigo que "sai mês que vem".

Queríamos resolver isso de forma definitiva — sem contratar redator, sem criar mais uma tarefa manual no processo. A solução precisava funcionar sozinha.

---

## A Ideia: GitHub Actions + IA

A premissa era simples: um script Python que roda automaticamente toda semana, usa um modelo de linguagem para escrever o artigo e faz commit direto no repositório.

Nada de painel, nada de dashboard, nada de interface. Só código e automação.

### As peças do sistema

**GitHub Actions** cuida do agendamento. Com uma linha de cron (`0 9 * * 1`), o workflow dispara toda segunda às 9h UTC sem nenhuma intervenção humana.

**Groq API** é o motor de escrita. Usamos o modelo `openai/gpt-oss-120b` via Groq — velocidade de inferência alta e suporte a respostas longas, ideal para artigos de 1500+ palavras.

**Pexels API** resolve as imagens. O bot busca automaticamente uma foto relevante ao tema, baixa em alta resolução e salva no repositório junto com o post.

---

## Como o Bot Funciona, Passo a Passo

O script `generate_blog_post.py` executa quatro etapas em sequência:

### 1. Pesquisa de temas

A primeira chamada à API pede ao modelo uma lista de 5 temas de tecnologia relevantes para a semana, voltados para donos de PMEs:

```python
"Liste 5 temas de tecnologia altamente relevantes desta semana
para donos de pequenas e médias empresas que consideram investir
em software. Retorne APENAS um JSON array."
```

O retorno é um JSON simples — fácil de parsear, difícil de quebrar.

### 2. Geração de metadados

Uma segunda chamada escolhe o melhor tema e gera título, excerpt e slug. Mantemos essa etapa separada do artigo por um motivo importante: JSON com 1500 palavras de markdown aninhado quebra. Descobrimos isso na primeira versão do bot.

> **Aprendizado:** nunca peça ao modelo para colocar um artigo inteiro dentro de um campo JSON. Separe metadados e conteúdo em chamadas distintas.

### 3. Escrita do artigo

Com os metadados em mãos, uma terceira chamada escreve o artigo completo em markdown puro — sem JSON, sem wrapper. O modelo recebe o contexto da empresa (software para PMEs, tom profissional mas acessível) e produz seções estruturadas com exemplos práticos e CTA ao final.

### 4. Imagem automática via Pexels

Antes de salvar o arquivo, o bot consulta a API do Pexels com o tema como query, baixa a primeira foto em landscape e salva em `public/images/blog/{slug}.jpg`. Se a busca falhar por qualquer motivo, cai para uma imagem padrão — o post não quebra.

---

## A Estrutura do Arquivo Final

O bot gera um `.md` com frontmatter compatível com Next.js:

```markdown
---
title: "Título do Artigo"
date: "2026-03-18T10:00:00.000Z"
excerpt: "Frase de impacto."
coverImage: "/images/blog/slug-do-artigo.jpg"
---

# Título do Artigo

## Seção 1
...
```

Depois disso, o workflow faz `git add`, `git commit` e `git push`. O CI/CD do projeto detecta a mudança e faz o deploy automaticamente.

---

![GitHub Actions](images/actions.png)

## O Que Aprendemos no Caminho

### Erros que encontramos

**JSON aninhado quebra.** A primeira versão pedia o artigo inteiro dentro de um objeto JSON. Funcionou nos testes locais e quebrou em produção quando o artigo tinha aspas, apóstrofos ou quebras de linha no lugar errado. A solução foi separar as chamadas.

**`reasoning_effort` + streaming precisa de atenção.** Modelos com raciocínio interno emitem chunks de conteúdo intercalados. A função `stream_to_string` precisa tratar `delta.content` como `None` em alguns chunks — e não apenas concatenar cegamente.

**Mensagens de erro genéricas escondem o problema.** O primeiro `except` capturava tudo e imprimia só `Erro: ...`. Adicionamos `traceback.print_exc()` e o problema ficou óbvio em 30 segundos.

### O que funcionou bem

- Separar em múltiplas chamadas menores ao invés de uma chamada gigante
- Fallbacks em cada etapa (imagem padrão se Pexels falhar, JSON com regex se vier com texto extra)
- Logs verbosos no script — em GitHub Actions, o log é o único lugar para debugar

---

## Configuração em 5 Minutos

Se quiser replicar:

1. **Crie uma conta no Groq** e gere uma API key em `console.groq.com`
2. **Crie uma conta no Pexels** e gere uma API key gratuita em `pexels.com/api`
3. **Adicione os secrets** no GitHub: `GROQ_API_KEY` e `PEXELS_API_KEY`
4. **Crie o workflow** em `.github/workflows/weekly-blog-post.yml` com o cron desejado
5. **Rode manualmente** (`workflow_dispatch`) para validar antes de esperar a segunda-feira

O custo mensal é praticamente zero — Groq tem tier gratuito generoso e Pexels API é gratuita para uso não-comercial em volume baixo.

---

## Repositório do Projeto

O código-fonte completo deste bot de automação está disponível em nosso repositório no GitHub:  
[lucaspanzera1/blog-post-generator](https://github.com/lucaspanzera1/blog-post-generator)

---


## Vale a Pena?

Para nós, sim. O blog que ficava meses sem atualização agora publica toda semana. O conteúdo é relevante, em PT-BR, voltado para o nosso público. E o time não gasta nenhuma hora por semana nisso.

Automatização não é sobre preguiça — é sobre direcionar energia humana para onde ela realmente importa.

---

**Quer implementar algo assim na sua empresa?**

Desenvolvemos automações e sistemas sob medida para negócios que querem escalar sem aumentar o time operacional. [Fale com a Peluga Labs](/budget) ou no WhatsApp: [(31) 99182-6043](https://wa.me/5531991826043).
