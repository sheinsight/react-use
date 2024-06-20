import { Button, Card, KeyValue } from '@/components'
import { useAsyncEffect, useCounter, useToggle } from '@shined/react-use'

export function App() {
  const [status, toggle] = useToggle(false)
  const [count, actions] = useCounter(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useAsyncEffect(
    async (isCancelled) => {
      const timer = setInterval(() => {
        // use `isCancelled()` to check if the effect is cancelled (unmount).
        if (isCancelled()) return clearInterval(timer)
        // safely do something when component is not unmount.
        actions.inc(1)
      }, 1000)
    },
    [status],
  )

  return (
    <Card row={false}>
      <KeyValue label="Count" value={count} />
      <div>
        <Button onClick={toggle}>Toggle Status</Button>
      </div>
    </Card>
  )
}
