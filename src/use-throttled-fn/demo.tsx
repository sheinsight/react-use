import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, useThrottledFn } from '@shined/use'

const wait = 1000

export function App() {
  const [count, actions] = useCounter()
  const throttledInc = useThrottledFn(actions.inc, { wait })

  return (
    <Card>
      <Zone>
        <KeyValue label="Count" value={count} />
        <KeyValue label="wait" value={wait} />
      </Zone>
      <Zone>
        <Button onClick={() => actions.inc()}>Increment</Button>
        <Button onClick={() => throttledInc()}>throttled increment</Button>
      </Zone>
    </Card>
  )
}
