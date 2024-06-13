import { Button, Card, KeyValue, Zone } from '@/components'
import { useCloned, useSafeState } from '@shined/use'

export function App() {
  const [state, setState] = useSafeState({
    hash: 'shined',
    age: 18,
    hobbies: ['coding', 'reading'],
  })

  const [cloned, setCloned, sync] = useCloned(state, { manual: true })

  return (
    <Card>
      <KeyValue label="Origin state" value={JSON.stringify(state, null, 2)} />
      <KeyValue label="Cloned state" value={JSON.stringify(cloned, null, 2)} />

      <Zone>
        <Button onClick={() => setState({ ...state, age: state.age + 1 })}>Change origin</Button>
        <Button onClick={() => setCloned({ ...cloned, age: cloned.age + 1 })}>Change cloned</Button>
      </Zone>
      <Zone>
        <Button onClick={sync}>Sync origin</Button>
        <Button onClick={() => setState(cloned)}>Save Modified</Button>
      </Zone>
    </Card>
  )
}
