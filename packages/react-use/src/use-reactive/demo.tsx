import { Button, Card, KeyValue, OTP, Zone } from '@/components'
import { useReactive } from '@shined/react-use'
import { create } from '@shined/reactive'

export function App() {
  const [state, mutate] = useReactive(
    {
      name: 'Bob',
      age: 20,
      hobbies: ['running', 'coding'],
    },
    { create },
  )

  return (
    <Card>
      <Zone>
        {/* biome-ignore lint/suspicious/noAssignInExpressions: no wrap for demo */}
        <Button onClick={() => void (mutate.name = OTP())}>Random name</Button>
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
