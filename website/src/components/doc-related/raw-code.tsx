import Translate from '@docusaurus/Translate'
import { useToggle } from '@site/../src'
import CodeBlock from '@theme/CodeBlock'
import { Button } from '../demo-related'

const ignores = ['prettier-ignore', 'biome-ignore']
const threshold = 24

export function RawCode(
  props: Parameters<typeof CodeBlock>[0] & {
    lang?: string
    children?: string
  },
) {
  const rawCode = props.children || ''
  const lines = (rawCode || '').split('\n').filter((e) => !ignores.some((t) => e.includes(t)))
  const lineLen = lines.length
  const [show, toggleShow] = useToggle(lineLen <= threshold)
  const code = lines.join('\n').trim()

  const enableCollapse = lineLen > threshold

  return (
    <div className={`relative rounded-6.4px ${show ? '' : 'h-16rem overflow-hidden'}`}>
      <CodeBlock language={props.lang || 'tsx'} {...props}>
        {code}
      </CodeBlock>

      {enableCollapse && (
        <div
          className={`absolute w-full grid place-content-center h-4rem from-black/20 to-transparent dark:from-black/80 bottom-0 ${show ? '' : 'bg-gradient-to-t'}`}
        >
          <Button onClick={toggleShow}>
            {show ? (
              <Translate id="reference.usage.showLess">Show less</Translate>
            ) : (
              <Translate id="reference.usage.showMore">Show more</Translate>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
