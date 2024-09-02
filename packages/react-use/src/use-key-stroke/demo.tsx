import { Card, Key, KeyValue, Zone } from '@/components'
import { useCounter, useKeyStatus, useKeyStroke } from '@shined/react-use'

export function App() {
  const [count, actions] = useCounter()

  useKeyStroke(['=', 'ArrowUp'], () => actions.inc())
  useKeyStroke(['-', 'ArrowDown'], () => actions.dec(), { dedupe: true })

  const isEqualPressed = useKeyStatus(['=', 'ArrowUp'])
  const isPlusPressed = useKeyStatus(['-', 'ArrowDown'])

  return (
    <Card>
      <KeyValue label="Count" value={count} />
      <Zone>
        <Key className="w-14!" name="↓ / -" isPressed={isPlusPressed} />
        <Key className="w-14!" name="↑ / =" isPressed={isEqualPressed} />
      </Zone>
    </Card>
  )
}
