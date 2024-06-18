import { Button, Card, KeyValue, Zone, wait as mockFetch } from '@/components'
import { useAsyncFn } from '@shined/react-use'

export function App() {
  const fetchFn = useAsyncFn(() => mockFetch(300))

  return (
    <Card>
      <Zone>
        <KeyValue label="Value" value={fetchFn.value} />
        <KeyValue label="Loading" value={fetchFn.loading} />
      </Zone>
      <Button disabled={fetchFn.loading} onClick={fetchFn.run}>
        Fetch
      </Button>
    </Card>
  )
}
