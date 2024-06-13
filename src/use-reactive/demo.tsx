import { Button, Card, KeyValue, OTP, Zone } from '@/components'
import { useReactive } from '@shined/use'

export function App() {
  const [state, mutate] = useReactive({
    name: 'Bob',
    age: 20,
    hobbies: ['running', 'coding'],
  })

  return (
    <Card>
      <Zone>
        {/* biome-ignore lint/suspicious/noAssignInExpressions: node wrap for demo */}
        <Button onClick={() => (mutate.name = OTP())}>Random name</Button>
        <Button onClick={() => mutate.age++}>Age++</Button>
        <Button onClick={() => mutate.hobbies.push(OTP())}>Add hobby</Button>
      </Zone>
      <Zone>
        <KeyValue label="Name" value={state.name} />
        <KeyValue label="Age" value={state.age} />
      </Zone>
      <ul>
        {state.hobbies.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </Card>
  )
}
