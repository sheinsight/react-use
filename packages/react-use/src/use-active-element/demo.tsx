import { Button, Card, Input, KeyValue, Zone } from '@/components'
import { useActiveElement } from '@shined/react-use'

export function App() {
  const activeElement = useActiveElement()

  const tagName = activeElement?.tagName.toLowerCase()
  const value = tagName ? `<${tagName} />` : 'null'

  return (
    <Card>
      <KeyValue label="Active element" value={value} />

      <Zone>
        <Input placeholder="Click here to test" />
        <Button>Also press here</Button>
      </Zone>
    </Card>
  )
}
