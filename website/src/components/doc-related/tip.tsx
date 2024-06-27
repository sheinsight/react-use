import Interpolate from '@docusaurus/Interpolate'
import Link from '@docusaurus/Link'
import { translate } from '@docusaurus/Translate'
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
          <Interpolate
            values={{
              code: <code>ElementTarget</code>,
              link: <Link to="/docs/features/element-target">ElementTarget</Link>,
            }}
          >
            {translate({
              id: 'reference.doc.elementTarget',
              message: '{code}, see {link} for more details.',
            })}
          </Interpolate>
        </p>
      )
    case 'ref-getter':
      return (
        <Admonition type="tip">
          <p>
            <Interpolate
              values={{
                code: <code>{name}</code>,
                link: <Link to="/docs/features/ref-getter">Ref Getter</Link>,
              }}
            >
              {translate({
                id: 'reference.doc.refGetter',
                message: '{code} is merely a {link}, whose changes will not trigger components to re-render.',
              })}
            </Interpolate>
          </p>
        </Admonition>
      )
    case 'pausable':
      return (
        <Admonition type="tip">
          <p>
            <Interpolate
              values={{
                link: <Link to="/docs/features/pausable">Pausable</Link>,
              }}
            >
              {translate({
                id: 'reference.doc.pausable',
                message: 'Returns include {link} instance, which can be paused and resumed.',
              })}
            </Interpolate>
          </p>
        </Admonition>
      )
    case 'custom':
      return <Admonition type="tip">{props.children}</Admonition>
  }
}
