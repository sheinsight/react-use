import { Button, Card, Input } from '@/components'
import { useSetState } from '@shined/use'

export function App() {
  const [state, setState] = useSetState({ name: 'John Doe', age: '30' })

  return (
    <Card>
      <Input placeholder="Name" value={state.name} onChange={(e) => setState({ name: e.target.value })} />
      <Input placeholder="Age" value={state.age} onChange={(e) => setState({ age: e.target.value })} />
      <Button onClick={() => setState({ name: '', age: '' })}>Reset</Button>
    </Card>
  )
}
