import { Card, Key, KeyValue, Zone } from '@/components'
import { useCounter, useKeyStatus, useKeyStroke } from '@shined/use'

export function App() {
  const [count, actions] = useCounter()

  useKeyStroke('-', () => actions.dec(), { dedupe: true })
  useKeyStroke('=', () => actions.inc())

  const isPlusPressed = useKeyStatus('-')
  const isEqualPressed = useKeyStatus('=')

  return (
    <Card>
      <KeyValue label="Count" value={count} />
      <Zone>
        <Key name="-" isPressed={isPlusPressed} />
        <Key name="=" isPressed={isEqualPressed} />
      </Zone>
    </Card>
  )
}
