import { Button, Card, Zone, wait } from '@/components'
import { useMount, useToggle, useUnmount } from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const [show, toggle] = useToggle(false)

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
  useMount(() => toast.success('Child mounted!'))

  useMount(async () => {
    await wait(100)
    toast.success('Async callbacks are also supported!')
  })

  return <Zone border="primary">Child</Zone>
}
