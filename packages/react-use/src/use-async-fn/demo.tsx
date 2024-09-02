import { Button, Card, KeyValue, Zone, wait as mockFetch } from '@/components'
import { useAsyncFn } from '@shined/react-use'

export function App() {
  const fetchFn = useAsyncFn(() => mockFetch(300))

  return (
    <Card>
      <Zone>
        <KeyValue label="Loading" value={fetchFn.loading} />
        <KeyValue label="Value" value={fetchFn.value ?? 'click to fetch'} />
      </Zone>
      <Zone>
        <Button disabled={fetchFn.loading} onClick={fetchFn.run}>
          Fetch
        </Button>
        <Button onClick={fetchFn.run}>Fetch (without disabled status)</Button>
      </Zone>
    </Card>
  )
}
