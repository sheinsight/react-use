import { Button, Card, KeyValue, Toaster, toast } from '@/components'
import { useMutationObserver, useUnmount } from '@shined/react-use'
import { useRef } from 'react'

const boxCls = 'size-120px grid place-content-center rounded transition-all bg-blue'

export function App() {
  const divRef = useRef<HTMLDivElement>(null)

  const {
    observerRef: _ref,
    isSupported,
    ..._controls
  } = useMutationObserver(
    divRef,
    (records) => {
      toast.success(`Mutation detected: ${records[0]?.attributeName} changed!`)
    },
    { attributes: true },
  )

  function mutateStyle() {
    const el = divRef.current
    el?.classList.toggle('bg-red!')
  }

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Supported" value={isSupported} />
      <div ref={divRef} className={boxCls} />
      <Button onClick={mutateStyle}>Toggle bg color</Button>
      <Toaster />
    </Card>
  )
}
