import { Card } from '@/components'
import { useReFocus } from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  useReFocus(
    () => {
      toast.success('Refocused')
    },
    { wait: 6000 },
  )

  return (
    <Card>
      <div>This component will show a toast when the user refocuses on the window.</div>
      <Toaster />
    </Card>
  )
}
