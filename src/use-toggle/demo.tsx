import { Button, Card, KeyValue, Zone } from '@/components'
import { useCircularList, useToggle } from '@shined/react-use'

export function App() {
  const [bool, toggleBool] = useToggle(true)
  const [mode, toggleMode] = useToggle(['light', 'dark'] as const)
  const [value, listActions] = useCircularList(['A', 'B', 'C', 'D', 'F', 'G'])

  return (
    <Card>
      <Zone>
        <KeyValue label="bool" value={bool} />
        <KeyValue label="mode" value={mode} />
        <KeyValue label="value" value={value} />
      </Zone>
      <Zone>
        <Button onClick={toggleBool}>Toggle bool</Button>
        <Button onClick={toggleMode}>Toggle mode</Button>
        <Button onClick={() => listActions.prev()}>Prev value</Button>
        <Button onClick={() => listActions.next()}>Next value</Button>
      </Zone>
    </Card>
  )
}
