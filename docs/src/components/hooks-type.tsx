import { cn } from '@/utils'

interface HooksTypeProps {
  category?: string
  features?: ('Pausable' | 'IsSupported' | 'LowLevel' | 'DevOnly')[]
  pausable?: boolean
  isSupported?: boolean
  lowLevel?: boolean
  devOnly?: boolean
}

export const iconMap = {
  Element: <div className="i-mdi:hexagon-slice-6 size-1em" />,
  Sensors: <div className="i-mdi:access-point size-1em" />,
  Utilities: <div className="i-mdi:tools size-1em" />,
  ProUtilities: <div className="i-mdi:toolbox-outline w-1em" />,
  Browser: <div className="i-mdi:google-chrome size-1em" />,
  Lifecycle: <div className="i-mdi:react size-1em" />,
  State: <div className="i-mdi:atom size-1em" />,
  Animation: <div className="i-mdi:sparkles-outline size-1em" />,
  Pausable: <div className="i-mdi:pause-box-outline size-1em" />,
  IsSupported: <div className="i-mdi:checkbox-outline size-1em" />,
  LowLevel: <div className="i-mdi:power-plug-outline size-1em" />,
  DevOnly: <div className="i-mdi:dev-to size-1em" />,
  Network: <div className="i-mdi:internet size-1em" />,
  Reactive: <div className="i-mdi:rotate-orbit size-1em" />,
  SelectAll: <div className="i-mdi:check-all size-1em" />,
} as const

export function HooksType(props: HooksTypeProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span>
        Tags:
        {/* <Translate id="reference.tags.tag">Tags</Translate>: */}
      </span>
      <Labels {...props} />
    </div>
  )
}

export function Labels(
  props: HooksTypeProps & {
    categoryOrder?: 'last' | undefined
  },
) {
  const { features = [], categoryOrder, category } = props

  const isLast = categoryOrder === 'last'

  const cate = (
    <Label to={`/?category=${category}`}>
      {iconMap[category as keyof typeof iconMap] || ''}
      {category}
    </Label>
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {category && !isLast && cate}

      {features.includes('LowLevel') && (
        <Label bgColor="red" to="/?feature=LowLevel">
          {iconMap.LowLevel}
          LowLevel
        </Label>
      )}

      {features.includes('DevOnly') && (
        <Label bgColor="purple" to="/?feature=DevOnly">
          {iconMap.DevOnly}
          DevOnly
        </Label>
      )}

      {features.includes('IsSupported') && (
        <Label bgColor="blue" to="/?feature=IsSupported">
          {iconMap.IsSupported}
          isSupported
        </Label>
      )}

      {features.includes('Pausable') && (
        <Label bgColor="amber" to="/?feature=Pausable">
          {iconMap.Pausable}
          Pausable
        </Label>
      )}

      {category && isLast && cate}
    </div>
  )
}

const colors = (isLink = true) => ({
  transparent: 'bg-transparent',
  primary: isLink ? 'bg-primary/80 hover:bg-primary/90 active:bg-primary/100' : 'bg-primary/80',
  red: isLink ? 'bg-red-5/80 hover:bg-red-5/90 active:bg-red-5/100' : 'bg-red-5/80',
  amber: isLink ? 'bg-amber-5/80 hover:bg-amber-5/90 active:bg-amber-5/100' : 'bg-amber-5/80',
  blue: isLink ? 'bg-blue-5/80 hover:bg-blue-5/90 active:hover:bg-blue-5/100' : 'bg-blue-5/80',
  purple: isLink ? 'bg-purple-5/80 hover:bg-purple-5/90 active:bg-purple-5/100' : 'bg-purple-5/80',
})

interface LabelProps {
  bgColor?: 'transparent' | 'primary' | 'red' | 'amber' | 'blue' | 'purple'
  children: React.ReactNode
  // to?: Parameters<typeof Link>[0]['to']
  to?: string
}

export function Label(props: LabelProps) {
  const { bgColor = 'primary', to, children } = props
  const color = colors(!!to)[bgColor]

  return (
    <a href={to}>
      <div className={cn(color, 'inline-flex items-center gap-1 transition-all rounded text-white px-2 py-1 text-sm')}>
        {children}
      </div>
    </a>
  )
}
