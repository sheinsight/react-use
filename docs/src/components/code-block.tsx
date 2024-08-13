import { cn } from '@/utils'
import { useAsyncEffect, useClipboard } from '@shined/react-use'
import { useState } from 'react'
import { codeToHtml } from 'shiki'

import type { BundledLanguage, BundledTheme } from 'shiki'

interface Props {
  children?: string
  className?: string
  codeClassName?: string
  content?: string
  lang?: BundledLanguage | 'text'
  theme?: BundledTheme
}

export function CodeBlock(props: Props) {
  const [html, setHtml] = useState('')
  const { content, codeClassName = '', className = '', lang, theme, children } = props

  const code = content || children || ''
  const clipboard = useClipboard({ source: code })

  useAsyncEffect(
    async (isCancelled) => {
      const html = await codeToHtml(code, {
        lang: lang ?? 'json',
        theme: theme ?? 'one-dark-pro',
        transformers: [
          {
            pre(node) {
              this.addClassToHast(node, 'm-0 px-4 py-2')
            },
          },
        ],
      })

      if (!isCancelled()) setHtml(html)
    },
    [code, lang, theme],
  )

  return (
    <div className={cn('group w-9/10 md:w-full relative', className)}>
      <button
        type="button"
        onClick={() => clipboard.copy()}
        className={cn(
          'absolute border-0 rounded right-2 top-2 opacity-0 transition-all cursor-pointer font-bold',
          'bg-gray-2 dark:bg-gray-6 hover:bg-gray-3 active:bg-gray-3 dark:hover:bg-gray-7 dark:hover:active:bg-gray-7',
          clipboard.copied ? 'opacity-100!' : 'group-hover:opacity-100!',
        )}
      >
        <div className="py-1 px-2 text-sm text-gray-5! dark:text-white!">{clipboard.copied ? 'Copied' : 'Copy'}</div>
      </button>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <div className={cn('m-0 overflow-scroll', codeClassName)} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
