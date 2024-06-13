import { useLocation } from '@docusaurus/router'
import { repoBase } from '../utils'

interface SourceProps {
  name?: string
  tsx?: boolean
}

export function Source({ name, tsx }: SourceProps) {
  const { pathname } = useLocation()

  const slug = pathname.split('/').filter(Boolean).pop()
  const url = `${repoBase}/${(name ?? slug) || ''}`

  const list = [
    { name: '🪝 Hook', path: tsx ? 'index.tsx' : 'index.ts' },
    { name: '🎨 Demo', path: 'demo.tsx' },
    { name: '📄 Document', path: 'index.mdx' },
  ].map((item) => ({ ...item, url: `${url}/${item.path}` }))

  return (
    <div className="flex gap-2">
      {list.map((item) => (
        <a
          key={item.name}
          className="px-2 py-0 bg-primary/12 rounded text-primary/80 hover:text-primary"
          href={item.url}
          target="_blank"
          rel="noreferrer"
        >
          {item.name}
        </a>
      ))}
    </div>
  )
}
