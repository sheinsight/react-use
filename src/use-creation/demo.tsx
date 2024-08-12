import { Button, Card, KeyValue, Toaster, Zone, toast } from '@/components'
import { useCounter, useCreation, useUnmount } from '@shined/react-use'
import { useEffect } from 'react'

export function App() {
  const [count, actions] = useCounter(0)
  const [depCount, depActions] = useCounter(0)

  const map = useCreation(() => {
    console.log('Creating map...')

    const entries = Object.entries({
      name: 'Bob',
      age: Math.random().toString().slice(2, 4),
      hobby: 'coding',
    })

    return new Map<string, string>(entries)
  }, [depCount])

  useEffect(() => {
    toast.success(`Creating map... ${depCount}`)
  }, [depCount])

  useUnmount(() => toast.remove())

  return (
    <Card>
      <pre>{JSON.stringify(Object.fromEntries(map.entries()), null, 0)}</pre>

      <Zone>
        <KeyValue label="Count" value={count} />
        <KeyValue label="DepCount" value={depCount} />
      </Zone>

      <Zone>
        <Button onClick={() => actions.inc()}>Inc count</Button>
        <Button onClick={() => depActions.inc()}>Inc depCount</Button>
      </Zone>

      <Toaster />
    </Card>
  )
}
