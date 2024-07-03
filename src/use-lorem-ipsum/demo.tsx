import { Button, Card, KeyValue } from '@/components'
import { useLoremIpsum, useRender } from '@shined/react-use'

export function App() {
  const render = useRender()
  const lorem = useLoremIpsum()
  const lorem2 = useLoremIpsum(2)
  const randomLorem = useLoremIpsum({ stable: false })

  return (
    <Card>
      <KeyValue labelWidth="180px" label="Stable lorem ipsum" value={lorem} />
      <KeyValue labelWidth="180px" label="Stable lorem ipsum 2" value={lorem2} />
      <KeyValue labelWidth="180px" label="Random lorem ipsum" value={randomLorem} />
      <Button onClick={render}>Re-render</Button>
    </Card>
  )
}
