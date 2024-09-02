import { Button, Card, KeyValue, Zone } from '@/components'
import { useLoremIpsum, useTextDirection } from '@shined/react-use'

export function App() {
  const lorem = useLoremIpsum()
  const [dir, setDir] = useTextDirection({ initialValue: 'auto' })

  return (
    <Card>
      <div>{lorem}</div>
      <KeyValue label="Text direction" value={dir} />
      <Zone>
        <Button onClick={() => setDir('ltr')}>Set "LTR"</Button>
        <Button onClick={() => setDir('rtl')}>Set "RTL"</Button>
      </Zone>
    </Card>
  )
}
