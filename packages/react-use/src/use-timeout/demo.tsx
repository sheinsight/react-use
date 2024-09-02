import { Button, Card, KeyValue, Toaster, Zone, toast } from '@/components'
import { useTimeout, useUnmount } from '@shined/react-use'

export function App() {
  const isTimeout = useTimeout(2000)
  const timeout = useTimeout(2000, { controls: true, immediate: false })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <Zone border="primary">
        <KeyValue label="isTimeout" value={isTimeout} />
      </Zone>

      <Zone border="primary">
        <KeyValue label="isTimeout" value={timeout.isTimeout} />
        <Zone>
          <Button onClick={() => timeout.resume()}>Start timeout 2</Button>
          <Button onClick={() => timeout.reset()}>Reset timeout 2</Button>
          <Button onClick={() => timeout.pause()}>Stop timeout 2</Button>
        </Zone>
      </Zone>
      <Toaster />
    </Card>
  )
}
