import { Button, Card, KeyValue, Zone } from '@/components'
import { useCircularList, useToggle } from '@shined/react-use'

export function App() {
  const [mode, actions] = useToggle(['light', 'dark'] as const)
  const [value, listActions] = useCircularList(['A', 'B', 'C', 'D', 'F', 'G'])

  return (
    <Card>
      <Zone>
        <KeyValue label="mode" value={mode} />
        <KeyValue label="value" value={value} />
      </Zone>
      <Zone>
        <Button onClick={actions.toggle}>Toggle mode</Button>
        <Button onClick={actions.setLeft}>Set left</Button>
        <Button onClick={actions.setRight}>Set right</Button>
        <Button onClick={() => listActions.prev()}>Prev value</Button>
        <Button onClick={() => listActions.next()}>Next value</Button>
      </Zone>
    </Card>
  )
}
