import { KeyValue, Section } from '@/components'
import { useSupported } from '@shined/react-use'

export function App() {
  const isSupported = useSupported(() => 'EyeDropper' in window)

  return (
    <Section>
      <KeyValue label="EyeDropper Supported" value={isSupported} />
    </Section>
  )
}
