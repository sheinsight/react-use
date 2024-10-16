import { Button, Card, Toaster, Zone, toast } from '@/components'
import { useMounted, useToggle, useUnmount } from '@shined/react-use'

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
  const isMounted = useMounted()

  // use in render stage to check if the component is mounted in current render
  if (isMounted()) {
    console.log('Child is mounted now!')
  }

  function handler() {
    setTimeout(() => {
      const msg = `Child is ${isMounted() ? 'mounted' : 'not mounted yet'}!`
      toast[isMounted() ? 'error' : 'success'](msg)
    }, 1000)
  }

  return (
    <Zone border="primary" row>
      <Button onClick={handler}>Start timeout</Button>
    </Zone>
  )
}
