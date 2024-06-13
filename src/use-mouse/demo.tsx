import { Button, Card, KeyValue, Zone } from '@/components'
import { useMouse } from '@shined/use'

export function App() {
  const page = useMouse() // type is 'page' by default
  const client = useMouse({ type: 'client' })
  const screen = useMouse({ type: 'screen' })
  const move = useMouse({ type: 'movement' })

  const controls = [page, client, screen]
  const isActive = controls.every((e) => e.isActive())

  return (
    <Card>
      <KeyValue label="Type: page (default)" value={`(${page.x}, ${page.y}, ${page.sourceType})`} />
      <KeyValue label="Type: client" value={`(${client.x}, ${client.y}, ${client.sourceType})`} />
      <KeyValue label="Type: screen" value={`(${screen.x}, ${screen.y}, ${screen.sourceType})`} />
      <KeyValue label="Type: movement (useful when pointer locked)" value={`(${move.x}, ${move.y})`} />

      <Zone border="primary">
        <KeyValue label="isActive" value={isActive} />

        <Zone>
          {/* biome-ignore lint/complexity/noForEach: not wrap for demo */}
          <Button onClick={() => controls.forEach((e) => e.pause(true))}>Pause</Button>
          {/* biome-ignore lint/complexity/noForEach: not wrap for demo */}
          <Button onClick={() => controls.forEach((e) => e.resume(true))}>Resume</Button>
        </Zone>
      </Zone>
    </Card>
  )
}
