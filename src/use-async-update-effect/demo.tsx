import { Button, Card, KeyValue, wait as mockFetch } from '@/components'
import { useAsyncUpdateEffect, useCounter, useSafeState, useToggle } from '@shined/react-use'

export function App() {
  const [status, { toggle }] = useToggle(false)
  const [count, actions] = useCounter(0)
  const [value, setValue] = useSafeState('none')

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useAsyncUpdateEffect(
    async (isCancelled) => {
      const data = await mockFetch(1000)

      if (!isCancelled()) {
        setValue(data)
      } else {
        actions.inc()
      }
    },
    [status],
  )

  return (
    <Card row={false}>
      <KeyValue label="Value" value={value} />
      <KeyValue label="Ignored action count" value={count} />
      <div>
        <Button onClick={toggle}>Re-fetch data</Button>
      </div>
    </Card>
  )
}
