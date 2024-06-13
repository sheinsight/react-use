import { Button, Card, KeyValue, Zone } from '@/components'
import { useDeepCompareEffect, useUnmount, useUpdateDeepCompareEffect } from '@shined/use'
import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const [state, setState] = useState({ count: 0 })

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useUpdateDeepCompareEffect(() => {
    toast.success('useUpdateDeepCompareEffect: State updated')
  }, [state])

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useDeepCompareEffect(() => {
    toast.error('useDeepCompareEffect: State updated')
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
