import { cn, repoBase } from '@/utils'
import { useLang, useLocation } from 'rspress/runtime'

interface CardContentProps
  extends React.PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> {}

export function Card(
  props: CardContentProps & {
    row?: boolean
    id?: string
  },
) {
  const isZhCN = useLang() === 'zh-cn'
  const { pathname } = useLocation()

  const { id, children, row, className, ...rest } = props
  const direction = row ? 'flex items-center' : 'flex flex-col items-start'

  const isGetStarted = pathname.includes('get-started')
  const hookSlug = pathname.split('/').filter(Boolean).pop()
  const sourceUrl = `${repoBase}/${hookSlug}/demo.tsx`

  return (
    <div
      id={id}
      className={cn(
        'relative outline-primary/80 gap-2 bg-#AAAAAA/20 dark:bg-#888888/20 rounded-2 p-4 my-2',
        direction,
        className,
      )}
      {...rest}
    >
      {!isGetStarted && (
        <a
          href={sourceUrl}
          className="absolute text-primary hover:text-primary/80 transition-all right-2 top-2 text-sm underline"
        >
          {isZhCN ? '源码' : 'Source'}
        </a>
      )}
      {children}
    </div>
  )
}
