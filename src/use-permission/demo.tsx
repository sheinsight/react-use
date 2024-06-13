import { Button, Card, KeyValue } from '@/components'
import { usePermission, useRender } from '@shined/use'

export function App() {
  const render = useRender()

  const permissionStateRef = usePermission('clipboard-read', {
    onStateChange: render,
  })

  const permission = usePermission('geolocation', {
    controls: true,
    immediate: false,
    onStateChange: render,
  })

  return (
    <Card>
      <KeyValue label="isSupported" value={permission.isSupported} />
      <KeyValue label="Clipboard read permission state" value={permissionStateRef.current} />
      <KeyValue label="Geolocation permission state" value={permission.stateRef.current} />
      <Button onClick={permission.query}>Query geolocation permission</Button>
    </Card>
  )
}
