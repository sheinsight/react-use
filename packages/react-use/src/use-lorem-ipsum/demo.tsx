import { Button, Card } from '@/components'
import { useLoremIpsum, useRender } from '@shined/react-use'

export function App() {
  const render = useRender()

  const lorem = useLoremIpsum()
  const lorem2 = useLoremIpsum(2)
  const randomLorem = useLoremIpsum({ stable: false })

  return (
    <Card>
      <Button onClick={render}>Re-render</Button>
      <div>[Stable] {lorem}</div>
      <div>[Unstable] {randomLorem}</div>
      <div>[Length: 2] {lorem2}</div>
    </Card>
  )
}
