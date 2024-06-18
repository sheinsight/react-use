import { Button, Card, KeyValue, Zone, wait as mockFetch } from '@/components'
import {
  useCounter,
  useEffectOnce,
  useIntervalFn,
  useLatest,
  useSafeState,
  useUnmount,
  useUpdateEffect,
} from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const [count, actions] = useCounter(0)
  const latest = useLatest(count)

  useIntervalFn(actions.inc, 100)

  const [depCount, depActions] = useCounter(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useUpdateEffect(() => {
    mockFetch().then(() => {
      // This `count` will be stale, which is always be
      // the value that the effect was created with.
      toast.success(`Count: ${count}, Latest: ${latest.current}`)
    })
  }, [depCount])

  const [state, setState] = useSafeState(0)

  useEffectOnce(() => {
    const timer = window.setInterval(() => {
      // This `state` is stale, which is always be `0`.
      // It should be `setState((pre) => pre + 1)`,
      // or use `useLatest` to get the latest value to avoid stale closure
      setState(state + 1)
    }, 1000)
    return () => window.clearInterval(timer)
  })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Count" value={count} />
      <KeyValue label="Dependency count" value={depCount} />
      <KeyValue label="State (will be stale)" value={state} />
      <Zone>
        <Button onClick={() => depActions.inc()}>Increment dep counter</Button>
      </Zone>
      <Toaster />
    </Card>
  )
}
