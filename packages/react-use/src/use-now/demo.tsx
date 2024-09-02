import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, useDateFormat, useNow } from '@shined/react-use'

export function App() {
  // A Date object that updates at each frame by default
  const now = useNow()
  const dateStr = useDateFormat(now, 'YYYY-MM-DD HH:mm:ss:SSS')

  // with controls usage
  const [count, actions] = useCounter(0)
  const { now: _now, ...controls } = useNow({
    interval: 300,
    controls: true,
    immediate: false,
    callback: () => actions.inc(),
  })

  return (
    <Card>
      <KeyValue label="Now">{dateStr}</KeyValue>
      <Zone border="primary">
        <KeyValue label="isActive">{controls.isActive()}</KeyValue>
        <KeyValue label="Now">{_now.getTime()}</KeyValue>
        <KeyValue label="Update count">{count}</KeyValue>
        <Zone>
          <Button onClick={() => controls.resume(true)}>Resume</Button>
          <Button onClick={() => controls.pause(true)}>Pause</Button>
        </Zone>
      </Zone>
    </Card>
  )
}
