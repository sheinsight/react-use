import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, usePausableUpdateEffect } from '@shined/use'

export function App() {
  const [count, actions] = useCounter(0)
  const [depCount, depActions] = useCounter(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  const pausable = usePausableUpdateEffect(() => actions.inc(), [depCount])

  return (
    <Card>
      <KeyValue label="isEffectActive" value={pausable.isActive()} />

      <Zone>
        <Button onClick={() => pausable.pause(true)}>Pause effect</Button>
        <Button onClick={() => pausable.resume(true)}>Resume effect</Button>
      </Zone>

      <Zone>
        <KeyValue label="Dep count" value={depCount} />
        <KeyValue label="Count (inc via effect)" value={count} />
      </Zone>

      <Zone>
        <Button onClick={() => depActions.inc()}>Inc dep count</Button>
        <Button onClick={() => depActions.dec()}>Dec dep count</Button>
        <Button onClick={() => depActions.reset()}>Reset dep count</Button>
      </Zone>
    </Card>
  )
}
