import Link from '@docusaurus/Link'

interface HooksTypeProps {
  category?: string
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
      <span>Tags:</span>
      <Labels {...props} />
    </div>
  )
}

export function Labels(
  props: HooksTypeProps & {
    categoryOrder?: 'last' | undefined
  },
) {
  const { categoryOrder, category, lowLevel, isSupported, pausable, devOnly } = props

  const isLast = categoryOrder === 'last'

  const cate = (
    <Label to={`/search?category=${category}`}>
      {iconMap[category as keyof typeof iconMap] || ''}
      {category}
    </Label>
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {category && !isLast && cate}

      {lowLevel && (
        <Label bgColor="red" to="/search?feature=LowLevel">
          {iconMap.LowLevel}
          LowLevel
        </Label>
      )}

      {devOnly && (
        <Label bgColor="purple" to="/search?feature=DevOnly">
          {iconMap.DevOnly}
          DevOnly
        </Label>
      )}

      {isSupported && (
        <Label bgColor="blue" to="/search?feature=IsSupported">
          {iconMap.IsSupported}
          isSupported
        </Label>
      )}

      {pausable && (
        <Label bgColor="amber" to="/search?feature=Pausable">
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
  to?: Parameters<typeof Link>[0]['to']
}

export function Label(props: LabelProps) {
  const { bgColor = 'primary', to, children } = props
  const color = colors(!!to)[bgColor]

  return (
    <Link to={to}>
      <div className={`${color} inline-flex items-center gap-1 transition-all rounded text-white px-2 py-1 text-sm`}>
        {children}
      </div>
    </Link>
  )
}
