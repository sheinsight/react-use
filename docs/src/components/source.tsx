import { repoBase } from '@/utils'
import { useLocation } from 'rspress/runtime'

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
    <div>
      <p>Click links below to view source on GitHub.</p>
      <div className="flex gap-4 mt-4">
        {list.map((item) => (
          <a key={item.name} className="user-link" href={item.url} target="_blank" rel="noreferrer">
            {item.name}
          </a>
        ))}
      </div>
    </div>
  )
}
