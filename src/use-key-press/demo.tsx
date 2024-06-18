import { Card, KeyValue } from '@/components'
import { useCounter, useKeyPress, useUnmount } from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const [times, actions] = useCounter()

  useKeyPress('Enter', (e) => {
    e.preventDefault()
    actions.inc()
    toast.success('Key press')
  })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Key press times" value={times} />
      <Toaster />
    </Card>
  )
}
