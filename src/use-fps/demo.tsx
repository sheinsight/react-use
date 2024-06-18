import { Button, Card, KeyValue, Zone } from '@/components'
import { useFps } from '@shined/react-use'

export function App() {
  const { fps, ...controls } = useFps()

  return (
    <Card>
      <Zone>
        <KeyValue label="Active">{controls.isActive()}</KeyValue>
        <KeyValue label="FPS">{fps}</KeyValue>
      </Zone>
      <Zone>
        <Button onClick={() => controls.pause(true)}>Pause</Button>
        <Button onClick={() => controls.resume(true)}>Resume</Button>
      </Zone>
    </Card>
  )
}
