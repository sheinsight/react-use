import { cn } from '@site/src/utils'

interface KeyValueProps {
  label?: string
  labelWidth?: string
  value?: string | boolean | number | null
  color?: 'red' | 'amber' | 'blue' | 'lime'
  suffix?: string
  children?: string | boolean | number
}

const colors = {
  red: 'text-red-5/80',
  amber: 'text-amber-5/80',
  blue: 'text-blue-5/80',
  lime: 'text-primary/80',
}

export function KeyValue(props: KeyValueProps) {
  const value = props.children ?? props.value

  const isTrue = value === true
  const isFalse = value === false
  const color = isTrue ? 'lime' : isFalse ? 'red' : 'amber'

  return (
    <div className="flex gap2">
      <span className="text-black/80 dark:text-white/80" style={{ width: props.labelWidth }}>
        {props.label ?? 'Value'}:{' '}
      </span>
      <div className="flex-1">
        <span className={cn('font-bold', colors[props.color ?? color] || '')}>{`${value}`}</span>
        <span>{props.suffix}</span>
      </div>
    </div>
  )
}
