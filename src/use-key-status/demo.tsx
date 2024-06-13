import { Card, Key } from '@/components'
import { useKeyStatus } from '@shined/use'

export function App() {
  const isPlusPressed = useKeyStatus('-')
  const isEqualPressed = useKeyStatus('=')

  return (
    <Card row>
      <Key name="-" isPressed={isPlusPressed} />
      <Key name="=" isPressed={isEqualPressed} />
    </Card>
  )
}
