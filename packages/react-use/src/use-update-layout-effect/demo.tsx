import { Button, KeyValue, Section, Toaster, toast } from '@/components'
import { useCounter, useUnmount, useUpdateLayoutEffect } from '@shined/react-use'

export function App() {
  const [count, actions] = useCounter(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useUpdateLayoutEffect(() => {
    toast.success('Count changed!')
  }, [count])

  useUnmount(() => toast.remove())

  return (
    <Section>
      <KeyValue label="Count" value={count} />
      <Button onClick={() => actions.inc()}>Increment</Button>
      <Toaster />
    </Section>
  )
}
