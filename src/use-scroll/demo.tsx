import { Card } from '@/components'
import { useScroll } from '@shined/use'
import { useRef } from 'react'

export function App() {
  const divRef = useRef<HTMLDivElement>(null)

  const { position, directions, isScrolling, arrivedState } = useScroll(divRef, {
    behavior: 'smooth',
  })

  return (
    <Card row>
      <div ref={divRef} className="rounded p-4 size-240px bg-amber/80 overflow-scroll">
        <div className="rounded size-480px bg-primary/80" />
      </div>
      <pre>{JSON.stringify({ isScrolling, position, directions, arrivedState }, null, 2)}</pre>
    </Card>
  )
}
