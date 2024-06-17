import { Card, KeyValue } from '@/components'
import { usePageLeave } from '@shined/use'

export function App() {
  const isUserLeavePage = usePageLeave()

  return (
    <Card>
      <KeyValue label="Is user leave page">{isUserLeavePage}</KeyValue>
    </Card>
  )
}
