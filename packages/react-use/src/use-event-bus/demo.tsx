import { Button, Card, KeyValue, Zone } from '@/components'
import { useEventBus, useMount, useReactive } from '@shined/react-use'
import { create } from '@shined/reactive'

type EventType = 'eventA' | 'eventB' | 'eventC'

const busIdentifier = Symbol('demo-bus') // or simple string 'demo-bus'

export function App() {
  const bus = useEventBus<EventType>(busIdentifier)

  return (
    <Card>
      <Zone>
        <Button onClick={() => bus.emit('eventA', 1)}>Emit 'eventA': child.a++</Button>
        <Button onClick={() => bus.emit('eventB', 2)}>Emit 'eventB': child.b + 2</Button>
        <Button onClick={() => bus.emit('eventC', 3)}>Emit 'eventC': child.c + 3</Button>
      </Zone>
      <Child />
    </Card>
  )
}

function Child() {
  const [{ a, b, c }, mutate] = useReactive({ a: 0, b: 0, c: 0 }, { create })
  const bus = useEventBus<EventType>(busIdentifier)

  useMount(() => {
    bus.on((event: EventType, payload: number) => {
      switch (event) {
        case 'eventA':
          mutate.a += payload
          return
        case 'eventB':
          mutate.b += payload
          return
        case 'eventC':
          mutate.c += payload
          return
      }
    })
  })

  return (
    <Zone border="amber" row={false}>
      <div className="font-bold">Child Component</div>
      <div>I will catch all the event emitted by parent</div>
      <Zone>
        <KeyValue label="A" value={a} />
        <KeyValue label="B" value={b} />
        <KeyValue label="C" value={c} />
      </Zone>
    </Zone>
  )
}
