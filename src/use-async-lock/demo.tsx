import { Button, Card, KeyValue, OTP, Zone, wait as mockFetch } from '@/components'
import { useAsyncFn, useAsyncLock, useCounter } from '@shined/react-use'

export function App() {
  const [invalidCount, countActions] = useCounter(0)

  const fetchData = useAsyncFn(async () => {
    await mockFetch(300)
    return OTP()
  })

  const lockedFetchData = useAsyncLock(fetchData.run, countActions.inc)

  return (
    <Card>
      <KeyValue label="Fetched data" value={fetchData.value} />
      <KeyValue label="Locked status" value={fetchData.loading} />
      <KeyValue label="Invalid fetch times" value={invalidCount} />

      <Zone border="transparent">
        <Button onClick={lockedFetchData}>Click to fetch</Button>
        <Button onClick={lockedFetchData} disabled={fetchData.loading}>
          Fetch with locked status
        </Button>
      </Zone>
    </Card>
  )
}
