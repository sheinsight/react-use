import { Button, Card, KeyValue, Zone } from '@/components'
import { useRender } from '@shined/use'
import { useRef } from 'react'

export function App() {
  const render = useRender()
  const countRef = useRef<number>(0)

  return (
    <Card>
      <KeyValue label="Count" value={countRef.current} />
      <Zone>
        <Button onClick={() => countRef.current++}>Inc</Button>
        <Button onClick={() => countRef.current--}>Dec</Button>
        <Button onClick={render}>Render</Button>
        {/* biome-ignore lint/style/noCommaOperator: no wrap for demo */}
        <Button onClick={() => void (countRef.current++, render())}>Inc with render</Button>
        {/* biome-ignore lint/style/noCommaOperator: no wrap for demo */}
        <Button onClick={() => void (countRef.current--, render())}>Dec with render</Button>
      </Zone>
    </Card>
  )
}
