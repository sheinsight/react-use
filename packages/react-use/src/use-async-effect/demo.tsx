import { Button, Card, KeyValue, Toaster, Zone, wait as mockFetch, toast } from '@/components'
import { useAsyncEffect, useAsyncFn, useCounter, useSafeState, useToggle } from '@shined/react-use'

export function App() {
  const [status, { toggle }] = useToggle(false)
  const [count, actions] = useCounter(0)
  const [value, setValue] = useSafeState('none')

  const fetch = useAsyncFn(() => mockFetch(1000))

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useAsyncEffect(
    async (isCancelled) => {
      const data = await fetch.run()

      if (!isCancelled()) {
        toast.success('Data was fetched')
        setValue(data)
      } else {
        toast.error('Action was ignored')
        actions.inc()
      }
    },
    [status],
  )

  return (
    <Card>
      <h2>Try to click the button multiple times quickly.</h2>
      <Zone>
        <KeyValue label="Data" value={value} />
        <KeyValue label="Fetching" value={fetch.loading} />
      </Zone>
      <KeyValue label="Ignored count" value={count} />
      <Button onClick={toggle}>Re-fetch data</Button>
      <Toaster />
    </Card>
  )
}
