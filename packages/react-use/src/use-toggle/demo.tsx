import { Button, Card, KeyValue, Zone } from '@/components'
import { useCircularList, useToggle } from '@shined/react-use'

const list = ['A', 'B', 'C', 'D', 'E', 'F']

export function App() {
  const [mode, actions] = useToggle(['light', 'dark'])
  const [value, listActions] = useCircularList(list)

  return (
    <Card>
      <KeyValue label="Mode" value={mode} />
      <Zone>
        <Button onClick={actions.toggle}>Toggle mode</Button>
        <Button onClick={actions.setLeft}>Set left</Button>
        <Button onClick={actions.setRight}>Set right</Button>
        <Button onClick={() => actions.setState('light')}>Set light</Button>
        <Button onClick={() => actions.setState('dark')}>Set dark</Button>
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
