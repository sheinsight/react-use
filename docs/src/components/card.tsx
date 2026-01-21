import { cn, repoBase } from '@/utils'
import { useState } from 'react'
import { useLang, useLocation } from 'rspress/runtime'
import { CodeBlock } from './code-block'

interface CardProps extends React.PropsWithChildren {
  id?: string
  source?: string
}

/**
 * Card component for displaying demos.
 * When source is provided, shows the demo with code toggle and GitHub link.
 * When source is omitted, shows a simple demo card without action buttons.
 */
export function Card({ id, children, source }: CardProps) {
  const isZhCN = useLang() === 'zh-cn'
  const { pathname } = useLocation()
  const [showCode, setShowCode] = useState(false)

  const hookSlug = pathname.split('/').filter(Boolean).pop()
  const sourceUrl = `${repoBase}/${hookSlug}/demo.tsx`

  // Simple mode: no source code provided
  if (!source) {
    return (
      <div className="border border-gray-3 dark:border-gray-7 rounded-lg overflow-hidden my-4">
        <div id={id} className="relative bg-#AAAAAA/20 dark:bg-#888888/20 p-4">
          {children}
        </div>
      </div>
    )
  }

  // Full mode: with source code display
  return (
    <div className="border border-gray-3 dark:border-gray-7 rounded-lg overflow-hidden my-4">
      {/* Demo section */}
      <div id={id} className="relative bg-#AAAAAA/20 dark:bg-#888888/20 p-4">
        {children}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-3 dark:border-gray-7 bg-#AAAAAA/20 dark:bg-#888888/20">
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          className={cn(
            'flex items-center gap-1 px-3 py-1.5 text-sm rounded transition-all border-0 cursor-pointer',
            'bg-transparent hover:bg-gray-2 dark:hover:bg-gray-8',
            'text-gray-7 dark:text-gray-3',
          )}
          title={showCode ? (isZhCN ? '隐藏代码' : 'Hide Code') : isZhCN ? '显示代码' : 'Show Code'}
        >
          <svg
            className={cn('w-4 h-4 transition-transform', showCode && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label={showCode ? 'Collapse icon' : 'Expand icon'}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span>{showCode ? (isZhCN ? '隐藏代码' : 'Hide Code') : isZhCN ? '显示代码' : 'Show Code'}</span>
        </button>

        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-1 px-3 py-1.5 text-sm rounded transition-all border-0',
            'bg-transparent hover:bg-gray-2 dark:hover:bg-gray-8',
            'text-gray-7 dark:text-gray-3 no-underline hover:no-underline',
          )}
          title={isZhCN ? '在 GitHub 上查看' : 'View on GitHub'}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label="GitHub logo">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>{isZhCN ? 'GitHub' : 'GitHub'}</span>
        </a>
      </div>

      {/* Code section */}
      {showCode && (
        <div className="border-t border-gray-3 dark:border-gray-7">
          <CodeBlock lang="tsx" className="rounded-none">
            {source}
          </CodeBlock>
        </div>
      )}
    </div>
  )
}
