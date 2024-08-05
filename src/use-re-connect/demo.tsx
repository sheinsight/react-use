import { Card } from '@/components'
import { useReConnect } from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  useReConnect(() => {
    toast.success('Reconnected')
  })

  return (
    <Card>
      <div>This component will show a toast when the user reconnects to the internet.</div>
      <Toaster />
    </Card>
  )
}
