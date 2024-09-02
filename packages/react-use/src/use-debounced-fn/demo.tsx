import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, useDebouncedFn } from '@shined/react-use'

const wait = 300

export function App() {
  const [count, actions] = useCounter()
  const debouncedInc = useDebouncedFn(actions.inc, { wait })

  return (
    <Card>
      <Zone>
        <KeyValue label="Count" value={count} />
        <KeyValue label="wait" value={wait} />
      </Zone>
      <Zone>
        <Button onClick={() => actions.inc()}>Increment</Button>
        <Button onClick={() => debouncedInc()}>Debounced increment</Button>
      </Zone>
    </Card>
  )
}
