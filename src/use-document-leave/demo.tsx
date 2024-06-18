import { Card, KeyValue } from '@/components'
import { useDocumentLeave } from '@shined/react-use'

export function App() {
  const isUserLeaveDocument = useDocumentLeave()

  return (
    <Card>
      <KeyValue label="Is user leave page">{isUserLeaveDocument}</KeyValue>
    </Card>
  )
}
