import Link from '@docusaurus/Link'
import Admonition from '@theme/Admonition'

interface TipProps {
  name?: string
  type: 'target' | 'ref-getter' | 'pausable' | 'custom'
  children?: React.ReactNode
}

export function Tip(props: TipProps) {
  const { name, type } = props

  switch (type) {
    case 'target':
      return (
        <p>
          <code>ElementTarget</code>, see <Link to="/docs/features/element-target">ElementTarget</Link> for more
          details.
        </p>
      )
    case 'ref-getter':
      return (
        <Admonition type="tip">
          <p>
            <code>{name}</code> is merely a <Link to="/docs/features/ref-getter">Ref Getter</Link>, whose changes will
            not trigger components to re-render.
          </p>
        </Admonition>
      )
    case 'pausable':
      return (
        <Admonition type="tip">
          <p>
            Returns include <Link to="/docs/features/pausable">Pausable</Link> instance, which can be paused and
            resumed.
          </p>
        </Admonition>
      )
    case 'custom':
      return <Admonition type="tip">{props.children}</Admonition>
  }
}
