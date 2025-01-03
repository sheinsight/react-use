import { Card, KeyValue, Zone } from '@/components'
import { useLoremIpsum, useTextSelection } from '@shined/react-use'

export function App() {
  const lorem = useLoremIpsum()
  const { text, rects: _, ranges: __, selectionRef: ___ } = useTextSelection()

  return (
    <Card>
      <Zone border="primary">
        <div>{lorem}</div>
      </Zone>
      <Zone border="primary">
        <KeyValue label="Selected text" value={text || '(Nothing selected)'} />
      </Zone>
    </Card>
  )
}
