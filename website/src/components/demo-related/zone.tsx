import { cn } from '../utils'

const colors = {
  red: 'border-red-5/60',
  amber: 'border-amber-5/60',
  blue: 'border-blue-5/60',
  primary: 'border-primary/60',
  transparent: 'border-transparent border-0',
}

const borderTypes = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
  double: 'border-double',
}

interface Props {
  row?: boolean
  className?: string
  width?: string
  id?: string
  center?: boolean
  borderType?: 'solid' | 'dashed' | 'dotted' | 'double'
  border?: 'red' | 'amber' | 'blue' | 'primary' | 'transparent'
  children?: React.ReactNode
}

export function Zone(props: Props) {
  const {
    className,
    center = false,
    width = 'full',
    row = true,
    id,
    border = 'transparent',
    borderType = 'dashed',
  } = props

  const widthCls = width === 'full' ? 'w-full' : ''
  const flex = row ? 'flex gap-4 items-center' : 'flex flex-col gap-2 justify-center'
  const padding = border === 'transparent' ? 'p-0' : 'px-4 py-2'
  const centerCls = row ? (center ? 'justify-center' : '') : center ? 'items-center' : ''

  return (
    <div
      id={id}
      className={cn(
        'rounded flex-wrap',
        widthCls,
        padding,
        borderTypes[borderType],
        colors[border],
        flex,
        centerCls,
        className,
      )}
      style={{ minWidth: width }}
    >
      {props.children}
    </div>
  )
}
