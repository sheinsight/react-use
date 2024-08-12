import { cn } from '@/utils'

export function Input(props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const { className, ...rest } = props

  return (
    <input
      className={cn(
        'outline-0 disabled:cursor-not-allowed input-border min-w-6rem px-1rem pt-0.5rem pb-0.4rem text-1rem',
        className,
      )}
      {...rest}
    />
  )
}
