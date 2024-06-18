import { Card, KeyValue } from '@/components'
import { useSupported } from '@shined/react-use'

export function App() {
  const isSupported = useSupported(() => 'EyeDropper' in window)

  return (
    <Card>
      <KeyValue label="EyeDropper Supported" value={isSupported} />
    </Card>
  )
}
