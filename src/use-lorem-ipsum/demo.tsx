import { Button, Card, KeyValue } from '@/components'
import { useLoremIpsum, useRender } from '@shined/use'

export function App() {
  const render = useRender()
  const lorem = useLoremIpsum()
  const lorem2 = useLoremIpsum(2)
  const randomLorem = useLoremIpsum({ stable: false })

  return (
    <Card>
      <KeyValue label="Stable lorem ipsum" value={lorem} />
      <KeyValue label="Stable lorem ipsum 2" value={lorem2} />
      <KeyValue label="Random lorem ipsum" value={randomLorem} />
      <Button onClick={render}>Rerender</Button>
    </Card>
  )
}
