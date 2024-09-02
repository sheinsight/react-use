import { Card, KeyValue } from '@/components'
import { useWindowSize } from '@shined/react-use'

export function App() {
  const size = useWindowSize()

  return (
    <Card row>
      <KeyValue label="Width" value={size.width} />
      <KeyValue label="Height" value={size.height} />
    </Card>
  )
}
