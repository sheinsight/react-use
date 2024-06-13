import { Card, Input } from '@/components'
import { useEffectOnce, useSafeState, useSignalState } from '@shined/use'

export function App() {
  const [name, setName] = useSignalState('')
  const [name2, setName2] = useSafeState('')

  useEffectOnce(() => {
    const timer = setInterval(() => {
      console.log('signal: ', name(), ' normal: ', name2)
    }, 1000)

    return () => clearInterval(timer)
  })

  return (
    <Card>
      <Input placeholder="Signal State Name" value={name()} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Normal State Name" value={name2} onChange={(e) => setName2(e.target.value)} />
    </Card>
  )
}
