import { Card, KeyValue } from '@/components'
import { useOnline } from '@shined/use'

export function App() {
  const isOnline = useOnline()

  return (
    <Card>
      <KeyValue label="Is online">{isOnline}</KeyValue>
    </Card>
  )
}
