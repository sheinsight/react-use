import { Button, Card, KeyValue, Toaster, Zone, toast } from '@/components'
import { useGetterRef, useRender, useUnmount } from '@shined/react-use'

export function App() {
  const [ref, get] = useGetterRef(0)
  const [isOpenRef, isOpen] = useGetterRef(false)

  const render = useRender()

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Value">{get()}</KeyValue>
      <Zone>
        <Button onClick={() => ref.current++}>Increment</Button>
        <Button onClick={() => ref.current--}>Decrement</Button>
        <Button onClick={render}>Render</Button>
        <Button onClick={() => toast.success(`Current value is ${get().toString()}`)}>Show value</Button>
      </Zone>
      <Zone>
        <KeyValue label="Is open">{isOpen()}</KeyValue>
      </Zone>
      <Zone>
        <Button
          onClick={() => {
            isOpenRef.current = true
          }}
        >
          Open
        </Button>
        <Button
          onClick={() => {
            isOpenRef.current = false
          }}
        >
          Close
        </Button>
        <Button onClick={render}>Render</Button>
        <Button onClick={() => toast.success(`Current value of isOpen is ${isOpen().toString()}`)}>Show isOpen</Button>
      </Zone>
      <Toaster />
    </Card>
  )
}
