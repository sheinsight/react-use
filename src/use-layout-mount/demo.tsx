import { Card } from '@/components'
import { useLayoutMount, useMount } from '@shined/react-use'
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

  useMount(() => {
    const { height } = ref.current?.getBoundingClientRect() ?? {}
    console.log('useMount', height)
  })

  return (
    <div ref={ref} className={'p-4 bg-primary/80 text-white rounded flex items-center'}>
      useMount
    </div>
  )
}

function LayoutMount() {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutMount(() => {
    const { height } = ref.current?.getBoundingClientRect() ?? {}
    console.log('useLayoutMount', height)
  })

  return (
    <div ref={ref} className={'p-4 bg-primary/80 text-white rounded flex items-center'}>
      useLayoutMount
    </div>
  )
}
