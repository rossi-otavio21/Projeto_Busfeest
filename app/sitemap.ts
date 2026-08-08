import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

const routes = [
  { path: '', priority: 1 },
  { path: '/viagens', priority: 0.8 },
  { path: '/fretamento', priority: 0.8 },
  { path: '/rotas', priority: 0.8 },
  { path: '/sobre', priority: 0.6 },
  { path: '/contato', priority: 0.6 },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return routes.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }))
}
