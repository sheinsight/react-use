import { Button, Card, Zone, wait } from '@/components'
import { useToggle, useUnmount } from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const [show, { toggle }] = useToggle(true)

  useUnmount(() => toast.remove())

  return (
    <Card>
      <Button onClick={toggle}>Toggle mount</Button>
      {show && <Child />}
      <Toaster />
    </Card>
  )
}

function Child() {
  useUnmount(() => toast.success('Child unmounted!'))

  useUnmount(async () => {
    await wait(100)
    toast.success('Async callbacks are also supported!')
  })

  return <Zone border="primary">Child</Zone>
}
