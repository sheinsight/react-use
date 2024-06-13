import { Card, KeyValue } from '@/components'
import { useCounter, useKeyUp, useUnmount } from '@shined/use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const [times, actions] = useCounter()

  useKeyUp('Enter', (e) => {
    e.preventDefault()
    actions.inc()
    toast.success('Key up')
  })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Key up times" value={times} />
      <Toaster />
    </Card>
  )
}
