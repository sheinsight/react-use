import { Button, Card, KeyValue, Zone } from '@/components'
import { useAsyncUpdateEffect, useCounter, useToggle } from '@shined/react-use'

import type { SetIntervalReturn } from '../utils/basic'

export function App() {
  const [show, toggle] = useToggle(true)

  return (
    <Card>
      <Button onClick={toggle}>Toggle mount</Button>
      {show && <Count />}
    </Card>
  )
}

function Count() {
  const [status, toggle] = useToggle(false)
  const [count, actions] = useCounter(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: for demo
  useAsyncUpdateEffect(
    async (isCancelled) => {
      const timer: SetIntervalReturn = window.setInterval(() => {
        // use `isCancelled()` to check if the effect is cancelled (unmount).
        if (isCancelled()) return window.clearInterval(timer)
        // safely do something when component is not unmount.
        actions.inc(1)
      }, 1000)
    },
    [status],
  )

  return (
    <Zone row={false} border="amber" width="">
      <KeyValue label="Count" value={count} />
      <Button onClick={toggle}>Toggle Status</Button>
    </Zone>
  )
}
