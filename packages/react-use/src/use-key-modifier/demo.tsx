import { Card, Key, Zone } from '@/components'
import { useKeyModifier } from '@shined/react-use'

export function App() {
  const isShiftPressed = useKeyModifier('Shift')
  const isMetaPressed = useKeyModifier('Meta')
  const isCtrlPressed = useKeyModifier('Control')
  const isAltPressed = useKeyModifier('Alt')
  const isCapsLockPressed = useKeyModifier('CapsLock')
  const isNumLockPressed = useKeyModifier('NumLock')
  const isScrollLockPressed = useKeyModifier('ScrollLock')

  return (
    <Card>
      <Zone>
        <Key name="Control" isPressed={isCtrlPressed} size="md" />
        <Key name="Alt/Opt" isPressed={isAltPressed} size="md" />
        <Key name="Command/Meta" isPressed={isMetaPressed} size="md" />
        <Key name="Shift" isPressed={isShiftPressed} size="md" />
      </Zone>
      <Zone>
        <Key name="CapsLock" isPressed={isCapsLockPressed} size="md" />
        <Key name="NumLock" isPressed={isNumLockPressed} size="md" />
        <Key name="ScrollLock" isPressed={isScrollLockPressed} size="md" />
      </Zone>
    </Card>
  )
}
