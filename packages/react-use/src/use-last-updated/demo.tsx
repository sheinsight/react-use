import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, useDateFormat, useLastUpdated } from '@shined/react-use'

export function App() {
  const [count, actions] = useCounter()
  const [other, otherActions] = useCounter()

  const date = useDateFormat(useLastUpdated(count) || '')
  const date2 = useDateFormat(useLastUpdated(other) || '')

  const tip = date ? `Last updated at ${date}` : 'Not update yet'
  const tip2 = date2 ? `Last updated at ${date2}` : 'Not update yet'

  return (
    <Card>
      <Zone row={false} border="primary">
        <KeyValue label="Count" value={`${count} (${tip})`} />
        <KeyValue label="Other" value={`${other} (${tip2})`} />
      </Zone>
      <Zone>
        <Button onClick={() => actions.inc()}>Increment count</Button>
        <Button onClick={() => otherActions.inc()}>Increment other</Button>
      </Zone>
    </Card>
  )
}
