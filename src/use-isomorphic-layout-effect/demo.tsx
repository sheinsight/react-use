import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, useIsomorphicLayoutEffect } from '@shined/react-use'

export function App() {
  const [count, actions] = useCounter(0)

  useIsomorphicLayoutEffect(() => {
    console.log(`Count: ${count}`)
  }, [count])

  return (
    <Card>
      <KeyValue label="Count" value={count} />
      <Zone>
        <Button onClick={() => actions.inc()}>Increment</Button>
        <Button onClick={() => actions.dec()}>Decrement</Button>
      </Zone>
    </Card>
  )
}
