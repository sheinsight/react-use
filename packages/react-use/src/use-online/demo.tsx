import { Card, KeyValue } from '@/components'
import { useOnline } from '@shined/react-use'

export function App() {
  const isOnline = useOnline()

  return (
    <Card>
      <KeyValue label="Is online">{isOnline}</KeyValue>
    </Card>
  )
}
