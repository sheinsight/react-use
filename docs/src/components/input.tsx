import { cn } from '@/utils'

export function Input(props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const { className, ...rest } = props

  return (
    <input
      className={cn('outline-0 disabled:cursor-not-allowed input-border min-w-6rem px-3 py-1 text-1rem', className)}
      {...rest}
    />
  )
}
