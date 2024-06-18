import { Card, KeyValue } from '@/components'
import { useCounter, useEffectOnce } from '@shined/react-use'

export function App() {
  const [count, actions] = useCounter(0)

  useEffectOnce(() => {
    const timer = window.setInterval(actions.inc, 1000)
    return () => window.clearInterval(timer)
  })

  return (
    <Card>
      <KeyValue label="Count" value={count} />
    </Card>
  )
}
