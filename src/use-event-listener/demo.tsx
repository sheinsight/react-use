import { Card, Zone } from '@/components'
import { useEventListener, useUnmount } from '@shined/react-use'
import { useRef } from 'react'
import { Toaster, toast } from 'react-hot-toast'

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
    <Card>
      <p className="my-2">Double click anywhere on the window to see the toast</p>
      <Zone border="amber">
        <div ref={divRef} className="size-full">
          <p className="my-2">Click inside the dashed box to see the toast</p>
        </div>
      </Zone>
      <Toaster />
    </Card>
  )
}
