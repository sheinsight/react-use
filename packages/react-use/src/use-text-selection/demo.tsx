import { KeyValue, Section, Zone } from '@/components'
import { useLoremIpsum, useTextSelection } from '@shined/react-use'

export function App() {
  const lorem = useLoremIpsum()
  const { text, rects: _, ranges: __, selectionRef: ___ } = useTextSelection()

  return (
    <Section>
      <Zone border="primary">
        <div>{lorem}</div>
      </Zone>
      <Zone border="primary">
        <KeyValue label="Selected text" value={text || '(Nothing selected)'} />
      </Zone>
    </Section>
  )
}
