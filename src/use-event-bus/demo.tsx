import { Button, Card, Zone } from '@/components'
import { useEffectOnce, useEventBus, useUnmount } from '@shined/use'
import { Toaster, toast } from 'react-hot-toast'

type EventType = 'eventA' | 'eventB' | 'eventC'

const busIdentifier = Symbol('demo-bus') // or simple string 'demo-bus'

export function App() {
  const bus = useEventBus<EventType>(busIdentifier)

  useUnmount(() => toast.remove())

  return (
    <Card>
      <Zone>
        <Button onClick={() => bus.emit('eventA', 'hi!')}>Emit 'eventA'</Button>
        <Button onClick={() => bus.emit('eventB', 'hello')}>Emit 'eventB'</Button>
        <Button onClick={() => bus.emit('eventC', 'world')}>Emit 'eventC'</Button>
      </Zone>
      <Child />
    </Card>
  )
}

function Child() {
  const bus = useEventBus<EventType>(busIdentifier)

  useEffectOnce(() => {
    bus.on((event: EventType, payload: string) => {
      switch (event) {
        case 'eventA':
          return toast.success(`Child: received Event A, ${payload}`)
        case 'eventB':
          return toast.success(`Child: received Event B, ${payload}`)
        case 'eventC':
          return toast.success(`Child: received Event C, ${payload}`)
      }
    })
  })

  return (
    <Zone border="amber" row={false}>
      <h4>Child Component</h4>
      <div>I will catch all the event emitted by parent</div>
      <Toaster />
    </Zone>
  )
}
