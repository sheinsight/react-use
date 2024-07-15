import { Button, Card, KeyValue, Zone } from '@/components'
import { useBoolean, useCircularList } from '@shined/react-use'

export function App() {
  const [bool, actions] = useBoolean(true)
  const [value, listActions] = useCircularList(['A', 'B', 'C', 'D', 'F', 'G'])

  return (
    <Card>
      <Zone>
        <KeyValue label="bool" value={bool} />
        <KeyValue label="value" value={value} />
      </Zone>
      <Zone>
        <Button onClick={actions.toggle}>Toggle bool</Button>
        <Button onClick={actions.setTrue}>Set true</Button>
        <Button onClick={actions.setFalse}>Set false</Button>
        <Button onClick={() => listActions.prev()}>Prev value</Button>
        <Button onClick={() => listActions.next()}>Next value</Button>
      </Zone>
    </Card>
  )
}
