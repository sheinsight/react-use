import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, useIntervalFn } from '@shined/use'

export function App() {
  const [count, actions] = useCounter(0)
  const controls = useIntervalFn(() => actions.inc(), 100)

  const isActive = controls.isActive()

  return (
    <Card>
      <Zone>
        <KeyValue label="Active">{isActive}</KeyValue>
        <KeyValue label="Count">{count}</KeyValue>
      </Zone>
      <Zone>
        {/* prettier-ignore */}
        <Button disabled={!isActive} onClick={() => controls.pause(true)}>
          Pause
        </Button>
        {/* prettier-ignore */}
        <Button disabled={isActive} onClick={() => controls.resume(true)}>
          Resume
        </Button>
      </Zone>
    </Card>
  )
}
