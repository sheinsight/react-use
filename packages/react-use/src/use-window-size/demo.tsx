import { KeyValue, Section } from '@/components'
import { useWindowSize } from '@shined/react-use'

export function App() {
  const size = useWindowSize()

  return (
    <Section row>
      <KeyValue label="Width" value={size.width} />
      <KeyValue label="Height" value={size.height} />
    </Section>
  )
}
