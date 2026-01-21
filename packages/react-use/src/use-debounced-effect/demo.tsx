import { Button, KeyValue, Section, Toaster, Zone, toast } from '@/components'
import { useCounter, useDebouncedEffect, useUnmount } from '@shined/react-use'

const wait = 300

export function App() {
  const [count, actions] = useCounter()

  useDebouncedEffect(
    () => {
      toast.success(`Count is ${count}`)
    },
    [count],
    { wait },
  )

  useUnmount(() => toast.remove())

  return (
    <Section>
      <Zone>
        <KeyValue label="Count" value={count} />
        <KeyValue label="wait" value={wait} />
      </Zone>
      <Button onClick={() => actions.inc()}>Increment</Button>
      <Toaster />
    </Section>
  )
}
