import { Button, Card, KeyValue, LabelInput, Zone } from '@/components'
import { useClonedState, useSafeState } from '@shined/react-use'

export function App() {
  const [state, setState] = useSafeState({ name: 'shined', age: 18 })
  const [cloned, setCloned, syncSource] = useClonedState(state)

  return (
    <Card>
      <KeyValue label="State" value={JSON.stringify(state, null, 2)} />
      <KeyValue label="Cloned state" value={JSON.stringify(cloned, null, 2)} />
      <LabelInput
        label="name"
        value={cloned.name}
        onChange={(e) => setCloned((cloned) => ({ ...cloned, name: e.target.value }))}
      />
      <Zone>
        <Button onClick={() => setState(cloned)}>Save</Button>
        <Button onClick={syncSource}>Reset</Button>
      </Zone>
    </Card>
  )
}
