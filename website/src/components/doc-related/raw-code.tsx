import CodeBlock from '@theme/CodeBlock'

const ignores = ['prettier-ignore', 'biome-ignore']

export function RawCode(
  props: Parameters<typeof CodeBlock>[0] & {
    lang?: string
    children?: string
  },
) {
  const rawCode = props.children || ''

  const code = (rawCode || '')
    .split('\n')
    .filter((e) => !ignores.some((t) => e.includes(t)))
    .join('\n')
    .trim()

  return (
    <CodeBlock language={props.lang || 'tsx'} {...props}>
      {code}
    </CodeBlock>
  )
}
