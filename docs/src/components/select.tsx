import { cn } from '@/utils'

interface SelectProps
  extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {}

export function Select(props: SelectProps) {
  const { className = '', ...rest } = props

  return (
    <select
      className={cn(
        className,
        'input-border rounded-4px cursor-pointer text-1rem disabled:bg-#aaaaaa/48 outline-none',
        'transition will-change-auto text-dark dark:text-white disabled:cursor-not-allowed px-2 py-1',
      )}
      {...rest}
    />
  )
}
