import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, usePrevious } from '@shined/use'

export function App() {
  const [count, actions] = useCounter(0)
  const previousCount = usePrevious(count)

  return (
    <Card>
      <KeyValue label="Current count" value={count} />
      <KeyValue label="Previous count" value={previousCount} />
      <Zone>
        <Button onClick={() => actions.inc()}>Increment</Button>
        <Button onClick={() => actions.dec()}>Decrement</Button>
      </Zone>
    </Card>
  )
}
