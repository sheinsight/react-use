import { Button, Card, Input } from '@/components'
import { useSetState } from '@shined/react-use'

export function App() {
  const defaultInfo = { name: 'John Doe', age: '30' }
  const [state, setState] = useSetState(defaultInfo, { deep: true })

  return (
    <Card>
      <Input placeholder="Name" value={state.name} onChange={(e) => setState({ name: e.target.value })} />
      <Input placeholder="Age" value={state.age} onChange={(e) => setState({ age: e.target.value })} />
      <Button onClick={() => setState({ ...defaultInfo })}>Reset</Button>
    </Card>
  )
}
