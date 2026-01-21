import { KeyValue, Section } from '@/components'
import { useOnline } from '@shined/react-use'

export function App() {
  const isOnline = useOnline()

  return (
    <Section>
      <KeyValue label="Is online">{isOnline}</KeyValue>
    </Section>
  )
}
