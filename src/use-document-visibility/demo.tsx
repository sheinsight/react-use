import { Card, KeyValue } from '@/components'
import { useDocumentVisibility, useTitle } from '@shined/react-use'

export function App() {
  const visibility = useDocumentVisibility()

  useTitle(visibility, { template: 'Visibility: %s' })

  return (
    <Card>
      <KeyValue label="Visibility" value={visibility} />
    </Card>
  )
}
