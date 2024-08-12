interface TipProps {
  name?: string
  type: 'target' | 'ref-getter' | 'pausable' | 'custom'
  children?: React.ReactNode
}

export function Tip(props: TipProps) {
  return <div>TIp</div>
}
