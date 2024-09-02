import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, useFirstRender } from '@shined/react-use'

export function App() {
  const [count, actions] = useCounter(0)
  const isFirstRender = useFirstRender()

  console.log('Count:', count, 'isFirstRender:', isFirstRender)

  return (
    <Card>
      <p>Open the console to see the log. (Rspress will render twice when demo mounted)</p>
      <Zone>
        <KeyValue label="isFirstRender" value={isFirstRender} />
        <KeyValue label="Count" value={count} />
      </Zone>
      <Button onClick={() => actions.inc(1)}>Inc(1)</Button>
    </Card>
  )
}
