import { cn } from '@/utils'

const keyCls = 'grid place-items-center transition-all p-2px font-bold rounded-md text-white'

export interface KeyProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  isPressed: boolean | null
  className?: string
}

export function Key(props: KeyProps) {
  const { name, isPressed, className, size = 'sm' } = props
  const sizeCls = size === 'sm' ? 'size-12' : size === 'lg' ? 'w-32 h-16' : 'w-24 h-12'
  const bgColor = isPressed ? 'bg-primary/80' : 'bg-#888888/60 shadow-lg pb-1'

  return (
    <div className={cn(className, bgColor, sizeCls, keyCls)}>
      <div className="border rounded border-solid border-#DDDDDD/60 grid place-content-center w-full h-full">
        {name}
      </div>
    </div>
  )
}
