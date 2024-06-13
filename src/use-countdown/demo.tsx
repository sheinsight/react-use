import { Button, Card, Input, KeyValue, Zone } from '@/components'
import { useCountdown, useSafeState } from '@shined/use'

export function App() {
  const ms = useCountdown(() => new Date('2030-01-01T00:00:00Z'))

  const [date, setDate] = useSafeState(() => Date.now())
  const countdown = useCountdown(date, {
    controls: true,
    interval: 1000,
  })

  const seconds = Math.ceil(countdown.ms / 1000)

  return (
    <Card>
      <KeyValue label="ms from `now` to `2030-01-01`" value={ms} />

      <Zone>
        <Input placeholder="SMS verification code" />
        <Button disabled={!countdown.isStop} onClick={() => setDate(Date.now() + 3_000)}>
          {!countdown.isStop ? `${seconds}s` : 'Send'}
        </Button>
      </Zone>
    </Card>
  )
}
