import { Button, Card, KeyValue, Toaster, Zone, toast } from '@/components'
import { useTimeoutFn, useUnmount } from '@shined/react-use'

export function App() {
  function handleTimeout() {
    toast.success('Timeout')
  }

  const pausable = useTimeoutFn(handleTimeout, 300, { immediate: false, updateOnEnd: true })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="isActive" value={pausable.isActive()} />
      <Zone>
        <Button onClick={() => pausable.resume(true)}>Start timeout</Button>
        <Button onClick={() => pausable.pause(true)}>Stop timeout</Button>
      </Zone>
      <Toaster />
    </Card>
  )
}
