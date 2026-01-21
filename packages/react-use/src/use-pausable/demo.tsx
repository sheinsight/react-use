import { Button, KeyValue, Section, Zone } from '@/components'
import { usePausable } from '@shined/react-use'

export function App() {
  const pausable = usePausable(false)

  return (
    <Section>
      <KeyValue label="isActive" value={pausable.isActive()} />
      <Zone>
        <Button onClick={() => pausable.resume()}>Resume</Button>
        <Button onClick={() => pausable.pause()}>Pause</Button>
        <Button onClick={() => pausable.resume(true)}>Resume (with re-render)</Button>
        <Button onClick={() => pausable.pause(true)}>Pause (with re-render)</Button>
      </Zone>
      <Zone />
    </Section>
  )
}
