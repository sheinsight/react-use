import { Card, KeyValue } from '@/components'
import { formatDate, normalizeDate, useUserIdle } from '@shined/react-use'

export function App() {
  // 1_000 is for demo. 60_000 by default when not provided
  const idleInfo = useUserIdle(1_000)
  const time = formatDate(normalizeDate(idleInfo.lastActive), 'YYYY-MM-DD HH:mm:ss')

  return (
    <Card>
      <KeyValue label="Is User Idle" value={idleInfo.isIdle} />
      <KeyValue label="Last Active" value={time} />
    </Card>
  )
}
