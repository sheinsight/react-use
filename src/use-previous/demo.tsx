import { Button, Card, KeyValue, Zone } from '@/components'
import { useCounter, usePrevious } from '@shined/react-use'
import { StrictMode } from 'react'

export function App() {
  const [count, actions] = useCounter(0)

  const previousCount = usePrevious(count)
  const prePrevious = usePrevious({ count: previousCount }, { deep: true })
  const prePrePreviousCount = usePrevious(prePrevious?.count)

  return (
    <Card>
      <Zone>
        <KeyValue label="CurCount" value={count} />
        <KeyValue label="PreCount" value={previousCount} />
        <KeyValue label="PrePreCount" value={prePrevious?.count} />
        <KeyValue label="PrePrePreCount" value={prePrePreviousCount} />
      </Zone>
      <Zone>
        <Button onClick={() => actions.inc()}>Increment</Button>
        <Button onClick={() => actions.dec()}>Decrement</Button>
      </Zone>
      <Zone>
        <StrictMode>
          <Content />
        </StrictMode>
      </Zone>
    </Card>
  )
}

function Content() {
  const [count, actions] = useCounter(0)

  const p0 = usePrevious(count)
  const p1 = usePrevious(p0)
  const p2 = usePrevious(p1)
  const p3 = usePrevious(p2)
  const p4 = usePrevious(p3)
  const p5 = usePrevious(p4)

  return (
    <>
      <Zone>
        <KeyValue label="Count" value={count} />

        {[p0, p1, p2, p3, p4, p5].map((p, i) => (
          <span className="mx-1" key={i.toString()}>
            {p ?? 'undefined'}
          </span>
        ))}
      </Zone>

      <Button onClick={() => actions.inc(1)}>Increment</Button>
    </>
  )
}
