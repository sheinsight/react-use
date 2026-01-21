import { Button, KeyValue, Section, Zone } from '@/components'
import { useResetState } from '@shined/react-use'

export function App() {
  const [state, setState, reset, initialValue] = useResetState(0)

  return (
    <Section>
      <Zone>
        <KeyValue label="State">{state}</KeyValue>
        <KeyValue label="Initial State">{initialValue}</KeyValue>
      </Zone>
      <Zone>
        <Button onClick={() => setState(state + 1)}>Increment</Button>
        <Button onClick={() => setState(state - 1)}>Decrement</Button>
        <Button onClick={() => reset()}>Reset</Button>
        <Button onClick={() => reset(10)}>Reset(10)</Button>
      </Zone>
    </Section>
  )
}
