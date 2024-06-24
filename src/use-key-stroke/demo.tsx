import { Card, Key, KeyValue, Zone } from '@/components'
import { useCounter, useKeyStatus, useKeyStroke } from '@shined/react-use'

export function App() {
  const [count, actions] = useCounter()

  useKeyStroke(['=', 'ArrowUp'], () => actions.inc())
  useKeyStroke(['-', 'ArrowDown'], () => actions.dec(), { dedupe: true })

  const isPlusPressed = useKeyStatus(['=', 'ArrowUp'])
  const isEqualPressed = useKeyStatus(['-', 'ArrowDown'])

  return (
    <Card>
      <KeyValue label="Count" value={count} />
      <Zone>
        <Key name="-/↓" isPressed={isPlusPressed} />
        <Key name="=/↑" isPressed={isEqualPressed} />
      </Zone>
    </Card>
  )
}
