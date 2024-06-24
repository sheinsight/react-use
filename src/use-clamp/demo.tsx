import { Button, Card, KeyValue, Zone } from '@/components'
import { useClamp, useCounter } from '@shined/react-use'

export function App() {
  const [max, maxActions] = useCounter(10)
  const [min, minActions] = useCounter(0)

  const [count, actions] = useClamp(6, min, max)

  return (
    <Card>
      <Zone>
        <KeyValue label="Min" value={min} />
        <KeyValue label="Max" value={max} />
        <KeyValue label="Count" value={count} />
      </Zone>
      <Zone>
        <Button onClick={() => actions.inc()}>inc(1)</Button>
        <Button onClick={() => actions.dec()}>dec(1)</Button>
        <Button onClick={() => actions.reset()}>Reset</Button>
      </Zone>
      <Zone>
        <Button onClick={() => minActions.inc()}>Min+1</Button>
        <Button onClick={() => minActions.dec()}>Min-1</Button>
        <Button onClick={() => maxActions.inc()}>Max+1</Button>
        <Button onClick={() => maxActions.dec()}>Max-1</Button>
      </Zone>
    </Card>
  )
}
