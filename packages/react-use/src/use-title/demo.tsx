import { Button, Card, Input, Zone } from '@/components'
import { useControlledComponent } from '@shined/react-use'
import { useTitle, useToggle } from '@shined/react-use'

export function App() {
  const [show, { toggle }] = useToggle(true)

  return (
    <Card>
      <Button onClick={toggle}>Toggle mount</Button>
      {show && <Child />}
    </Card>
  )
}

function Child() {
  const input = useControlledComponent('useTitle')

  useTitle(input.value, {
    template: '🌟 %s 🌟',
    restoreOnUnmount: true,
  })

  return (
    <Zone border="primary">
      <Input placeholder="Title" {...input.props} />
    </Zone>
  )
}
