import { useLocation } from '@docusaurus/router'
import { repoBase } from '../utils'

interface CardContentProps
  extends React.PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> {}

export function Card(
  props: CardContentProps & {
    row?: boolean
    id?: string
  },
) {
  const { pathname } = useLocation()

  const { id, children, row, className, ...rest } = props
  const direction = row ? 'flex items-center' : 'flex flex-col items-start'

  const isGetStarted = pathname.includes('get-started')
  const hookSlug = pathname.split('/').filter(Boolean).pop()
  const sourceUrl = `${repoBase}/${hookSlug}/demo.tsx`

  return (
    <div
      id={id}
      className={`relative outline-primary/80 gap-4 bg-#AAAAAA/20 dark:bg-#888888/20 rounded-2 p-6 my-2 ${direction} ${className}`}
      {...rest}
    >
      {!isGetStarted && (
        <a href={sourceUrl} className="absolute right-2 top-2 text-xs underline">
          Source
        </a>
      )}
      {children}
    </div>
  )
}
