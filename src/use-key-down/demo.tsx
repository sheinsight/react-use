import { Card, KeyValue } from '@/components'
import { useCounter, useKeyDown, useUnmount } from '@shined/use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const [times, actions] = useCounter()

  useKeyDown('Enter', (e) => {
    e.preventDefault()
    actions.inc()
    toast.success('Key down')
  })

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Key down times" value={times} />
      <Toaster />
    </Card>
  )
}
