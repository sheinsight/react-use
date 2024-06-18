import { Card, KeyValue } from '@/components'
import { useTimeAgo } from '@shined/react-use'
import { useRef } from 'react'

export function App() {
  const threeMinutesAgo = useRef(Date.now() - 3 * 60_000)

  const results = [
    useTimeAgo(threeMinutesAgo.current),
    useTimeAgo('2023-01-01T00:00:00Z'),
    useTimeAgo('2024-06-01T00:00:00Z'),
    useTimeAgo('2024-12-01T00:00:00Z'),
    useTimeAgo('2027-01-01T00:00:00Z'),
  ]

  return (
    <Card>
      {results.map((result, idx) => (
        <KeyValue key={result} label={`Result ${idx + 1}`} value={result} />
      ))}
    </Card>
  )
}
