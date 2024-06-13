import { Card, KeyValue } from '@/components'
import { useSupported } from '@shined/use'

export function App() {
  const isSupported = useSupported(() => 'EyeDropper' in window)

  return (
    <Card>
      <KeyValue label="EyeDropper Supported" value={isSupported} />
    </Card>
  )
}
