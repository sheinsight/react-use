import { cn } from '@/utils'

interface ButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {}

export function Button(
  props: ButtonProps & {
    variant?: 'primary' | 'secondary' | 'danger' | 'warning'
    mono?: boolean
  },
) {
  const { mono = false, type, variant = 'primary', className = '', ...rest } = props

  const variants = {
    primary:
      'bg-primary/80 disabled:bg-#aaaaaa/48 outline-primary/80 enabled:hover:bg-primary/90 enabled:active:bg-primary',
    secondary:
      'bg-#aaaaaa/80 disabled:bg-#aaaaaa/48 outline-#aaaaaa/80 enabled:hover:bg-#aaaaaa/90 enabled:active:bg-#aaaaaa',
    danger:
      'bg-#bf4342/80 disabled:bg-#aaaaaa/48 outline-#bf4342/80 enabled:hover:bg-#bf4342/90 enabled:active:bg-#bf4342',
    warning:
      'bg-#e09f3e/80 disabled:bg-#aaaaaa/48 outline-#e09f3e/80 enabled:hover:bg-#e09f3e/90 enabled:active:bg-#e09f3e',
  }

  const variantCls = `rounded-4px border-none cursor-pointer text-1rem ${variants[variant]}`

  return (
    <button
      type={props.type || 'button'}
      className={cn(
        className,
        variantCls,
        mono && 'font-mono',
        'transition will-change-auto enabled:hover:shadow-md rounded-4px text-white border-none cursor-pointer text-1rem disabled:cursor-not-allowed px-4 py-2 enabled:active:pb-6px enabled:active:pt-10px',
      )}
      {...rest}
    />
  )
}
