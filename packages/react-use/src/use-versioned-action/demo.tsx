import { Button, Card, KeyValue, OTP, Zone, wait as mockFetch } from '@/components'
import { useSafeState, useVersionedAction } from '@shined/react-use'

export function App() {
  const [value, setValue] = useSafeState('Click to Fetch')
  const [incVersion, runVersionedAction] = useVersionedAction()

  const fetch = async () => {
    await mockFetch(300 + Math.random() * 1_000)
    setValue(OTP())
  }

  const versionedFetch = async () => {
    const version = incVersion()
    await mockFetch(300 + Math.random() * 1_000)
    runVersionedAction(version, () => {
      setValue(OTP())
    })
  }

  return (
    <Card>
      <KeyValue label="Value" value={value} />
      <Zone>
        <Button onClick={fetch}>Fetch</Button>
        <Button onClick={versionedFetch}>Versioned Fetch</Button>
      </Zone>
    </Card>
  )
}
