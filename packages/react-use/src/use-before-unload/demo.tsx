import { Button, Card, KeyValue, Zone } from '@/components'
import { useBeforeUnload, useToggle } from '@shined/react-use'

export function App() {
  const [show, { toggle }] = useToggle(true)

  function callback(event: BeforeUnloadEvent) {
    // do something before the page is unload, such as sending beacon
  }

  useBeforeUnload(callback, { preventDefault: show })

  return (
    <Card>
      <KeyValue label="Show confirm dialog" value={show} />
      <Zone>
        <Button onClick={() => location.reload()}>Reload this page</Button>
        <Button onClick={toggle}>Toggle confirm dialog</Button>
      </Zone>
    </Card>
  )
}
