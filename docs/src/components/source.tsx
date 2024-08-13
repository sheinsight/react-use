import { defaultLang, repoBase } from '@/utils'
import { useLang, useLocation } from 'rspress/runtime'

interface SourceProps {
  name?: string
  tsx?: boolean
}

export function Source({ name, tsx }: SourceProps) {
  const { pathname } = useLocation()
  const lang = useLang()
  const isZhCN = lang === 'zh-cn'
  const isDefaultLang = lang === defaultLang

  const slug = pathname.split('/').filter(Boolean).pop()
  const url = `${repoBase}/${(name ?? slug) || ''}`

  const list = [
    { name: '🪝 Hook', path: tsx ? 'index.tsx' : 'index.ts' },
    { name: '🎨 Demo', path: 'demo.tsx' },
    { name: '📄 Document', path: isDefaultLang ? 'index.mdx' : `index.${lang}.mdx` },
  ].map((item) => ({ ...item, url: `${url}/${item.path}` }))

  return (
    <div>
      {isZhCN ? <p>点击下方链接跳转 GitHub 查看源代码。</p> : <p>Click links below to view source on GitHub.</p>}
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
