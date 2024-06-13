import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter } from '@shined/use'

export function App() {
  const [count, action, { max, min, initialCount }] = useCounter(1, { max: 20, min: 0 })

  return (
    <Card>
      <Zone>
        <KeyValue label="Count" value={count} />
        <KeyValue label="Min" value={min} />
        <KeyValue label="Max" value={max} />
        <KeyValue label="Initial" value={initialCount} />
      </Zone>
      <Zone>
        <Button onClick={() => action.inc()}>Inc()</Button>
        <Button onClick={() => action.inc(2)}>Inc(2)</Button>
        <Button onClick={() => action.dec()}>Dec()</Button>
        <Button onClick={() => action.dec(2)}>Dec(2)</Button>
      </Zone>
      <Zone>
        <Button onClick={() => action.reset(count)}>Reset(count)</Button>
        <Button onClick={() => action.reset()}>Reset()</Button>
        <Button onClick={() => action.reset(10)}>Reset(10)</Button>
      </Zone>
    </Card>
  )
}
