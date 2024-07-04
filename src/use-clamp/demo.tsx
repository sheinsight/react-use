import { Button, Card, KeyValue, Zone } from '@/components'
import { useClamp, useCounter } from '@shined/react-use'

export function App() {
  const [max, maxActions] = useCounter(16)
  const [min, minActions] = useCounter(4)

  const [count, actions] = useClamp(8, min, max)

  return (
    <Card>
      <div className="rounded transition-all p-1 bg-primary/36 box-content" style={{ width: max * 20 }}>
        <div className="rounded transition-all h-[20px] bg-primary/80" style={{ width: count * 20 }} />
      </div>

      <Zone>
        <KeyValue label="Min" value={min} />
        <KeyValue label="Max" value={max} />
        <KeyValue label="Count" value={count} />
      </Zone>
      <Zone>
        <Button onClick={() => actions.inc()}>inc(1)</Button>
        <Button onClick={() => actions.dec()}>dec(1)</Button>
        <Button onClick={() => actions.reset()}>Reset</Button>
        <Button onClick={() => actions.reset(12)}>Reset 12</Button>
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
