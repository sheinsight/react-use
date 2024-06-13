import { Button, Card, KeyValue, Zone } from '@/components'
import { useDeepCompareLayoutEffect, useUnmount } from '@shined/use'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const [state, setState] = useState({ count: 0 })

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useDeepCompareLayoutEffect(() => {
    toast.success('deep: State updated')
  }, [state])

  useEffect(() => {
    toast.error(`useEffect: State updated ${state.count}`)
  }, [state])

  useUnmount(() => toast.remove())

  return (
    <Card>
      <KeyValue label="Count" value={state.count} />
      <Zone>
        <Button onClick={() => setState({ count: state.count + 1 })}>Increment</Button>
        <Button onClick={() => setState({ count: state.count })}>Set "same" object</Button>
      </Zone>
      <Toaster />
    </Card>
  )
}
