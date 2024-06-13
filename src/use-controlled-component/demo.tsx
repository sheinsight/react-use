import { Button, Card, Input } from '@/components'
import { useControlledComponent, useUnmount } from '@shined/use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const input = useControlledComponent('React is awesome!')

  useUnmount(() => toast.remove())

  return (
    <Card row>
      <Input {...input.props} />
      <Button onClick={() => toast.success(input.value)}>Toast input value</Button>
      <Toaster />
    </Card>
  )
}
