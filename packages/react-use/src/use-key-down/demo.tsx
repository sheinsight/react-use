import { Card, Key, KeyValue, Toaster, toast } from '@/components'
import { useCounter, useKeyDown, useKeyStatus, useUnmount } from '@shined/react-use'

export function App() {
  const [times, actions] = useCounter()
  const isEnterPressed = useKeyStatus('Enter')

  useKeyDown('Enter', (e) => {
    e.preventDefault()
    actions.inc()
    toast.success('Key down')
  })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Key down times" value={times} />
      <Key size="md" name="Enter" isPressed={isEnterPressed} />
      <Toaster />
    </Card>
  )
}
