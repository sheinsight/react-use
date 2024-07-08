import Translate, { translate } from '@docusaurus/Translate'
import { useLocation } from '@docusaurus/router'
import { repoBase } from '@site/src/utils'

interface SourceProps {
  name?: string
  tsx?: boolean
}

export function Source({ name, tsx }: SourceProps) {
  const { pathname } = useLocation()

  const slug = pathname.split('/').filter(Boolean).pop()
  const url = `${repoBase}/${(name ?? slug) || ''}`

  const list = [
    { name: translate({ id: 'reference.source.code', message: '🪝 Hook' }), path: tsx ? 'index.tsx' : 'index.ts' },
    { name: translate({ id: 'reference.source.demo', message: '🎨 Demo' }), path: 'demo.tsx' },
    {
      name: translate({ id: 'reference.source.doc', message: '📄 Document' }),
      path: translate({ id: 'reference.source.docFileName', message: 'index.mdx' }),
    },
  ].map((item) => ({ ...item, url: `${url}/${item.path}` }))

  return (
    <div>
      <p>
        <Translate id="reference.source.description">Click links below to view source on GitHub.</Translate>
      </p>
      <div className="flex gap-4">
        {list.map((item) => (
          <a
            key={item.name}
            className="py-0 text-primary/80 hover:text-primary"
            href={item.url}
            target="_blank"
            rel="noreferrer"
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  )
}
