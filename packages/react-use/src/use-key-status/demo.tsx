import { Card, Key, Zone } from '@/components'
import { useKeyStatus } from '@shined/react-use'

export function App() {
  const isPlusPressed = useKeyStatus('-')
  const isEqualPressed = useKeyStatus('=')
  const isUpPressed = useKeyStatus('ArrowUp')
  const isDownPressed = useKeyStatus('ArrowDown')

  // lowercase `react`
  const isRPressed = useKeyStatus('r')
  const isEPressed = useKeyStatus('e')
  const isAPressed = useKeyStatus('a')
  const isCPressed = useKeyStatus('c')
  const isTPressed = useKeyStatus('t')

  // uppercase `USE`
  const isUUPressed = useKeyStatus('U')
  const isSSPressed = useKeyStatus('S')
  const isEEPressed = useKeyStatus('E')

  return (
    <Card>
      <Zone>
        <Key name="-" isPressed={isPlusPressed} />
        <Key name="=" isPressed={isEqualPressed} />
        <Key name="↑" isPressed={isUpPressed} />
        <Key name="↓" isPressed={isDownPressed} />
      </Zone>
      <Zone>
        <Key name="r" isPressed={isRPressed} />
        <Key name="e" isPressed={isEPressed} />
        <Key name="a" isPressed={isAPressed} />
        <Key name="c" isPressed={isCPressed} />
        <Key name="t" isPressed={isTPressed} />
      </Zone>
      <Zone>
        <Key name="U" isPressed={isUUPressed} />
        <Key name="S" isPressed={isSSPressed} />
        <Key name="E" isPressed={isEEPressed} />
      </Zone>
    </Card>
  )
}
