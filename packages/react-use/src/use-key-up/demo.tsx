import { Card, Key, KeyValue, Toaster, toast } from '@/components'
import { useCounter, useKeyStatus, useKeyUp, useUnmount } from '@shined/react-use'

export function App() {
  const [times, actions] = useCounter()
  const isEnterPressed = useKeyStatus('Enter')

  useKeyUp('Enter', (e) => {
    e.preventDefault()
    actions.inc()
    toast.success('Key up')
  })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Key up times" value={times} />
      <Key size="md" name="Enter" isPressed={isEnterPressed} />
      <Toaster />
    </Card>
  )
}
