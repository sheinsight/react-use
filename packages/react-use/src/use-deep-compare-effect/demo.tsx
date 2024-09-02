import { Button, Card, KeyValue, Toaster, Zone, toast } from '@/components'
import { useDeepCompareEffect, useUnmount } from '@shined/react-use'
import { useEffect, useState } from 'react'

export function App() {
  const [state, setState] = useState({ count: 0 })

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useDeepCompareEffect(() => {
    toast.success('deep: State updated')
  }, [state])

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useEffect(() => {
    toast.error('useEffect: State updated')
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
