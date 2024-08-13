import { Card, Key, KeyValue, Toaster, toast } from '@/components'
import { useCounter, useKeyStatus, useKeyStrokeOnce, useUnmount } from '@shined/react-use'

export function App() {
  const [times, actions] = useCounter()
  const isEnterPressed = useKeyStatus('Enter')

  useKeyStrokeOnce('Enter', (e) => {
    e.preventDefault()
    actions.inc()
    toast.success('Key stroke')
  })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Key stroke times" value={times} />
      <Key size="md" name="Enter" isPressed={isEnterPressed} />
      <Toaster />
    </Card>
  )
}
