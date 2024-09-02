import { Card } from '@/components'
import { useLayoutMount, useMount, useSafeState } from '@shined/react-use'
import { useRef } from 'react'

export function App() {
  return (
    <Card>
      <LayoutMount />
      <Mount />
    </Card>
  )
}

function Mount() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useSafeState(0)

  const now = performance.now()
  while (performance.now() - now < 200) {}

  useMount(() => {
    const { height = 0 } = ref.current?.getBoundingClientRect() ?? {}
    setHeight(height)
  })

  return (
    <div style={{ height: height + 10 }} ref={ref} className={'p-4 bg-primary/80 text-white rounded flex items-center'}>
      useMount
    </div>
  )
}

function LayoutMount() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useSafeState(0)

  const now = performance.now()
  while (performance.now() - now < 200) {}

  useLayoutMount(() => {
    const { height = 0 } = ref.current?.getBoundingClientRect() ?? {}
    setHeight(height)
  })

  return (
    <div style={{ height: height + 10 }} ref={ref} className={'p-4 bg-primary/80 text-white rounded flex items-center'}>
      useLayoutMount
    </div>
  )
}
