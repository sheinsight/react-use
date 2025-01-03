import { Button, Card, KeyValue, Toaster, toast } from '@/components'
import { useCounter, useUnmount, useUpdateEffect } from '@shined/react-use'

export function App() {
  const [count, actions] = useCounter(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useUpdateEffect(() => {
    toast.success('Count changed!')
  }, [count])

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Count" value={count} />
      <Button onClick={() => actions.inc()}>Increment</Button>
      <Toaster />
    </Card>
  )
}
