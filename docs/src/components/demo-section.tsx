import { cn } from '@/utils'

interface SectionProps extends React.PropsWithChildren {
  row?: boolean
  className?: string
}

/**
 * A layout component that provides consistent styling for demo content.
 * Used inside demo.tsx files to wrap the demo UI elements.
 */
export function Section({ children, row, className }: SectionProps) {
  const direction = row ? 'flex items-center' : 'flex flex-col items-start'

  return <div className={cn('gap-2', direction, className)}>{children}</div>
}
