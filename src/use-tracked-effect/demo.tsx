import { Button, Card, KeyValue, LabelInput, Zone } from '@/components'
import { useCounter, useSetState, useTrackedEffect } from '@shined/react-use'

export function App() {
  const [state, setState] = useSetState({ name: 'John Doe', age: 30 })
  const [count, actions] = useCounter(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useTrackedEffect(
    (indexes, _prev, _curr) => {
      console.log(`deps changed: ${indexes.join(', ')}`)
    },
    [count, state.name, state.age, state],
  )

  return (
    <Card>
      <pre>{`${JSON.stringify(state, null, 2)}\n\ncount: ${count}`}</pre>
      <LabelInput
        label="Name"
        value={state.name}
        onChange={(e) => {
          setState({ ...state, name: e.target.value })
        }}
      />
      <KeyValue label="Count" value={count} />
      <Zone>
        <Button onClick={() => actions.inc()}>Increment</Button>
        <Button onClick={() => setState({ age: state.age + 1 })}>Age++</Button>
      </Zone>
    </Card>
  )
}
