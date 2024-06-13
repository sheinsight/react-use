import { Button, Card, Input, Zone } from '@/components'
import { useControlledComponent } from '@shined/use'
import { useMount, useTitle, useToggle } from '@shined/use'

export function App() {
  const [show, toggle] = useToggle(true)

  return (
    <Card>
      <Button onClick={toggle}>Toggle mount</Button>
      {show && <Child />}
    </Card>
  )
}

function Child() {
  const input = useControlledComponent('')

  const initialTitle = useTitle(input.value, {
    template: '🌟 %s 🌟',
    restoreOnUnmount: true,
  })

  useMount(() => input.setValue(initialTitle()))

  function resetTitle() {
    document.title = initialTitle()
  }

  return (
    <Zone border="primary">
      <Input placeholder="Title" {...input.props} />
      <Button onClick={resetTitle}>Reset title</Button>
    </Zone>
  )
}
