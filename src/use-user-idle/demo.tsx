import { Card, KeyValue } from '@/components'
import { useIntervalFn, useUserIdle } from '@shined/use'

export function App() {
  // 1_000 is for demo. 60_000 by default when not provided
  const idleInfo = useUserIdle(1_000)

  useIntervalFn(() => {
    console.log('Last Active:', idleInfo.lastActive.current)
  }, 1000)

  return (
    <Card>
      <KeyValue label="Is User Idle" value={idleInfo.isIdle} />
    </Card>
  )
}
