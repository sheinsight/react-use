import { Button, Card, KeyValue } from '@/components'
import { useCircularList } from '@shined/use'

const fruits = ['🍌 banner', '🍎 apple', '🍇 grape', '🍉 watermelon', '🍊 orange']

export function App() {
  const [state, actions, index] = useCircularList(fruits)

  return (
    <Card>
      <KeyValue label="List items" value={fruits.join(', ')} />
      <KeyValue label="Current item" value={state} />
      <KeyValue label="Current item index" value={index} />

      <div className="flex gap-2">
        <Button onClick={() => actions.prev()}>Prev</Button>
        <Button onClick={() => actions.next()}>Next</Button>
        <Button onClick={() => actions.next(2)}>Next(2)</Button>
        <Button onClick={() => actions.go(2)}>Go index 2</Button>
      </div>
    </Card>
  )
}
