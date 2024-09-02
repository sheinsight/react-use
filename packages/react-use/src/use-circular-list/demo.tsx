import { Button, Card, KeyValue } from '@/components'
import { useCircularList } from '@shined/react-use'

const fruits = ['🍌 banner', '🍎 apple', '🍇 grape', '🍉 watermelon', '🍊 orange']

export function App() {
  const [item, actions, index] = useCircularList(fruits)

  return (
    <Card>
      <div className="flex gap-2">
        {fruits.map((fruit) => (
          <div
            key={fruit}
            className={`transition-all font-bold ${fruit === item ? 'text-amber-5/80' : 'text-primary/80'}`}
          >
            {fruit}
          </div>
        ))}
      </div>
      <KeyValue label="Current" value={`[${index}] ${item}`} />

      <div className="flex gap-2">
        <Button onClick={() => actions.prev()}>Prev</Button>
        <Button onClick={() => actions.next()}>Next</Button>
        <Button onClick={() => actions.next(2)}>Next(2)</Button>
        <Button onClick={() => actions.go(2)}>Go index 2</Button>
      </div>
    </Card>
  )
}
