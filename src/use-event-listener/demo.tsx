import { Card, Toaster, Zone, toast } from '@/components'
import { useEventListener, useUnmount } from '@shined/react-use'
import { useRef } from 'react'

export function App() {
  const divRef = useRef<HTMLDivElement>(null)

  useEventListener(divRef, 'click', () => {
    toast.success('You clicked the box!')
  })

  useEventListener(
    () => window,
    'dblclick',
    () => {
      toast.success('You double clicked the window!')
    },
  )

  useUnmount(() => toast.remove())

  return (
    <Card className="select-none">
      <Zone border="amber" className="bg-primary/20">
        <div ref={divRef} className="size-full">
          <p className="my-2">Click inside this dashed box to see the toast</p>
        </div>
      </Zone>
      <Toaster />
    </Card>
  )
}
