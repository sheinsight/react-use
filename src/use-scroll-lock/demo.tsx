import { Button, Card, KeyValue, Zone } from '@/components'
import { useScrollLock } from '@shined/use'
import { useRef } from 'react'

export function App() {
  const divRef = useRef<HTMLDivElement>(null)
  const [isLocked, _setLocked, actions] = useScrollLock(divRef, false)

  return (
    <Card>
      <div ref={divRef} className="rounded p-4 size-36 bg-blue-2 overflow-scroll">
        <div className="rounded size-40 bg-gradient-to-tr from-primary to-amber" />
      </div>
      <KeyValue label="isLocked" value={isLocked} />
      <Zone>
        <Button onClick={actions.lock}>Lock</Button>
        <Button onClick={actions.unlock}>Unlock</Button>
        <Button onClick={actions.toggle}>Toggle lock</Button>
      </Zone>
    </Card>
  )
}
