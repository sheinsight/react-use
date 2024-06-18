import { Button, Card, KeyValue, Zone } from '@/components'
import { useInterval } from '@shined/react-use'

export function App() {
  const intervals = useInterval(100)
  const [count, actions] = useInterval(300, { controls: true })

  return (
    <Card>
      <Zone border="primary">
        <KeyValue label="Intervals" value={intervals} />
      </Zone>
      <Zone border="primary">
        <Zone>
          <KeyValue label="Count" value={count} />
          <KeyValue label="Active" value={actions.isActive()} />
        </Zone>
        <Zone>
          <Button onClick={() => actions.resume(true)}>Resume</Button>
          <Button onClick={() => actions.pause(true)}>Pause</Button>
          <Button onClick={() => actions.reset()}>Reset</Button>
        </Zone>
      </Zone>
    </Card>
  )
}
