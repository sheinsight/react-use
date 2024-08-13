import { Button, Card, KeyValue, Zone } from '@/components'
import { useBoolean, useCircularList } from '@shined/react-use'

const list = ['A', 'B', 'C', 'D', 'E', 'F']

export function App() {
  const [bool, actions] = useBoolean(true)
  const [value, listActions] = useCircularList(list)

  return (
    <Card>
      <KeyValue label="Boolean Value" value={bool} />
      <Zone>
        <Button onClick={actions.toggle}>Toggle bool</Button>
        <Button onClick={actions.setTrue}>Set true</Button>
        <Button onClick={actions.setFalse}>Set false</Button>
      </Zone>
      <Zone>
        <KeyValue label="Circular List" value={list.join(', ')} />
        <KeyValue label="Circular Value" value={value} />
      </Zone>
      <Zone>
        <Button onClick={() => listActions.prev()}>Prev value</Button>
        <Button onClick={() => listActions.next()}>Next value</Button>
      </Zone>
    </Card>
  )
}
