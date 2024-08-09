import { Button, Card, Zone } from '@/components'
import { useToggle, useUnmount, useUnmounted } from '@shined/react-use'
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

export function Child() {
  const isUnmounted = useUnmounted()

  function handler() {
    setTimeout(() => {
      const msg = `Child is ${isUnmounted() ? 'unmounted' : 'still mounted'}!`
      toast[isUnmounted() ? 'error' : 'success'](msg)
    }, 1000)
  }

  return (
    <Zone border="primary" row>
      <Button onClick={handler}>Start timeout</Button>
    </Zone>
  )
}
