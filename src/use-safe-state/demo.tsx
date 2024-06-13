import { Button, Card, KeyValue, OTP, Zone } from '@/components'
import { useSafeState, useUnmount, useUpdateEffect } from '@shined/use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const [state, setState] = useSafeState('Hello')
  const [shallowState, setShallowState] = useSafeState({ name: 'Hooks' })
  const [deepState, setDeepState] = useSafeState({ name: 'Hooks' }, { deep: true })

  useUpdateEffect(() => void toast.success(`State: ${state}`), [state])
  useUpdateEffect(() => void toast.success(`Shallow: ${shallowState.name}`), [shallowState])
  useUpdateEffect(() => void toast.success(`Deep: ${deepState.name}`), [deepState])

  useUnmount(() => toast.remove())

  return (
    <Card>
      <Zone border="primary" row={false}>
        <KeyValue label="Basic State" value={state} />
        {/* prettier-ignore */}
        <Zone>
          <Button onClick={() => setState(OTP())}>Set state</Button>
        </Zone>
      </Zone>
      <Zone border="primary" row={false}>
        <KeyValue label="Shallow Object State" value={shallowState.name} />
        <Zone>
          <Button onClick={() => setShallowState({ name: 'Hooks' })}>Set same</Button>
          <Button onClick={() => setShallowState({ name: OTP() })}>Set different</Button>
        </Zone>
      </Zone>
      <Zone border="primary" row={false}>
        <KeyValue label="Deep Object State" value={deepState.name} />
        <Zone>
          <Button onClick={() => setDeepState({ name: 'Hooks' })}>Set same</Button>
          <Button onClick={() => setDeepState({ name: OTP() })}>Set different</Button>
        </Zone>
      </Zone>
      <Toaster />
    </Card>
  )
}
