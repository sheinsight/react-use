import { Card, KeyValue } from '@/components'
import { useCounter, useKeyStrokeOnce, useUnmount } from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const [times, actions] = useCounter()

  useKeyStrokeOnce('Enter', (e) => {
    e.preventDefault()
    actions.inc()
    toast.success('Key stroke')
  })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Key stroke times" value={times} />
      <Toaster />
    </Card>
  )
}
