import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, usePausableUpdateDeepCompareEffect, useSetState } from '@shined/react-use'

export function App() {
  const [count, actions] = useCounter(0)
  const [state, setState] = useSetState({ count: 0 })

  const addOne = () => setState((pre) => ({ count: pre.count + 1 }))
  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  const pausable = usePausableUpdateDeepCompareEffect(() => actions.inc(), [state])

  return (
    <Card>
      <KeyValue label="isEffectActive" value={pausable.isActive()} />

      <Zone>
        <Button onClick={() => pausable.pause(true)}>Pause effect</Button>
        <Button onClick={() => pausable.resume(true)}>Resume effect</Button>
      </Zone>

      <Zone>
        <KeyValue label="Dep state" value={JSON.stringify(state, null, 0)} />
        <KeyValue label="Count (inc via effect)" value={count} />
      </Zone>

      <Zone>
        <Button onClick={() => setState({ count: 0 })}>{'Set "same" value'}</Button>
        <Button onClick={addOne}>Set different value</Button>
      </Zone>
    </Card>
  )
}
