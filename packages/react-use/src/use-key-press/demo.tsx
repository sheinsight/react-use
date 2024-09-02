import { Card, Key, KeyValue, Toaster, toast } from '@/components'
import { useCounter, useKeyPress, useKeyStatus, useUnmount } from '@shined/react-use'

export function App() {
  const [times, actions] = useCounter()
  const isEnterPressed = useKeyStatus('Enter')

  useKeyPress('Enter', (e) => {
    e.preventDefault()
    actions.inc()
    toast.success('Key press')
  })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Key press times" value={times} />
      <Key size="md" name="Enter" isPressed={isEnterPressed} />
      <Toaster />
    </Card>
  )
}
