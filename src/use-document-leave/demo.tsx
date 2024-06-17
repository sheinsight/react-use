import { Card, KeyValue } from '@/components'
import { useDocumentLeave } from '@shined/use'

export function App() {
  const isUserLeaveDocument = useDocumentLeave()

  return (
    <Card>
      <KeyValue label="Is user leave page">{isUserLeaveDocument}</KeyValue>
    </Card>
  )
}
