import { Button, Card, KeyValue, Zone } from '@/components'
import { useRafState } from '@shined/react-use'

export function App() {
  const [state, setState] = useRafState({ count: 0 })

  return (
    <Card>
      <KeyValue label="Count" value={state.count} />
      <Zone>
        <Button onClick={() => setState({ count: state.count + 1 })}>Increment</Button>
        <Button onClick={() => setState({ count: state.count - 1 })}>Decrement</Button>
      </Zone>
    </Card>
  )
}
