import { Button, Card, Zone } from '@/components'
import { useClickOutside, useToggle } from '@shined/react-use'
import { useRef } from 'react'

export function App() {
  const [show, toggleShow, showActions] = useToggle(false)

  const ref = useRef<HTMLDivElement | null>(null)

  useClickOutside(ref, () => showActions.setState(false), { ignore: ['#btn-ignored'] })

  return (
    <Card>
      <Zone>
        <Button onClick={toggleShow}>Toggle Modal</Button>
        <Button variant="warning">Outer Element</Button>
        <Button variant="secondary" id="btn-ignored">
          Ignored Element
        </Button>
      </Zone>

      <div ref={ref} className={`m-2 p-2 w-[200px] rounded-2 absolute bg-amber/60 ${show ? '' : 'hidden'}`}>
        <h3>This is a Modal</h3>
        <p>Click outside to close</p>
      </div>
    </Card>
  )
}
