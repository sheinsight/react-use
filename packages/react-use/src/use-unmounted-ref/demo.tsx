import { Button, Section, Toaster, Zone, toast } from '@/components'
import { useToggle, useUnmount, useUnmountedRef } from '@shined/react-use'

export function App() {
  const [show, { toggle }] = useToggle(true)

  useUnmount(() => toast.remove())

  return (
    <Section>
      <Button onClick={toggle}>Toggle mount</Button>
      {show && <Child />}
      <Toaster />
    </Section>
  )
}

export function Child() {
  const ref = useUnmountedRef()

  function handler() {
    setTimeout(() => {
      const msg = `Child is ${ref.current ? 'unmounted' : 'still mounted'}!`
      toast[ref.current ? 'error' : 'success'](msg)
    }, 1000)
  }

  return (
    <Zone border="primary" row>
      <Button onClick={handler}>Start timeout</Button>
    </Zone>
  )
}
