import { Button, Card, KeyValue, Toaster, toast } from '@/components'
import { useCounter, useStableFn, useUnmount, useUpdateEffect } from '@shined/react-use'

export function App() {
  const [count, actions] = useCounter()

  const add = (a: number, b: number) => a + b
  const stableAdd = useStableFn(add)

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useUpdateEffect(() => {
    toast.error('This will be shown on every update as the function is not stable')
  }, [add])

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useUpdateEffect(() => {
    toast.success('This will never be shown as the function is stable')
  }, [stableAdd])

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Count" value={count} />
      <Button onClick={() => actions.inc()}>Increment</Button>
      <Toaster />
    </Card>
  )
}
