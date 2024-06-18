import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, useDebouncedEffect, useUnmount } from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

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
    <Card>
      <Zone>
        <KeyValue label="Count" value={count} />
        <KeyValue label="wait" value={wait} />
      </Zone>
      <Button onClick={() => actions.inc()}>Increment</Button>
      <Toaster />
    </Card>
  )
}
