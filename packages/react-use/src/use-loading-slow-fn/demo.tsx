import { Button, Card, KeyValue, Zone, wait as mockFetch } from '@/components'
import { useLoadingSlowFn } from '@shined/react-use'

export function App() {
  const fetchFn = useLoadingSlowFn(() => mockFetch(2000), { loadingTimeout: 1_000 })

  return (
    <Card>
      <Zone>
        <KeyValue label="Loading" value={fetchFn.loading} />
        <KeyValue label="LoadingSlow" value={fetchFn.loadingSlow} />
        <KeyValue label="Value" value={fetchFn.value ?? 'click to fetch'} />
      </Zone>
      <Button disabled={fetchFn.loading} onClick={fetchFn.run}>
        Fetch
      </Button>
    </Card>
  )
}
