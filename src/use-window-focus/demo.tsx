import { Card, KeyValue } from '@/components'
import { useWindowFocus } from '@shined/use'

export function App() {
  const isWinFocused = useWindowFocus()

  return (
    <Card>
      <KeyValue label="Is window focused" value={isWinFocused.toString()} />
    </Card>
  )
}
