import { MetadataRoute } from 'next'
import { getAllPosts } from '@/utils/blog'
import { solucoes } from '@/content/solucoes'

// lastModified só é informado quando há uma data real (frontmatter dos posts).
// Para páginas sem fonte confiável de data, o campo é omitido.
function postDate(date: string): Date | undefined {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://labs.peluga.com.br'
  const posts = getAllPosts()

  // Static routes
  const staticRoutes = [
    '',
    '/faq',
    '/budget',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Blog index: atualizado quando sai o post mais recente
  const blogIndexEntry = {
    url: `${baseUrl}/blog`,
    lastModified: posts.length > 0 ? postDate(posts[0].date) : undefined,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }

  // Dynamic blog routes
  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: postDate(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic solutions routes
  const solucaoEntries = solucoes.map((s) => ({
    url: `${baseUrl}/solucoes/${s.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...sitemapEntries, blogIndexEntry, ...blogEntries, ...solucaoEntries]
}
