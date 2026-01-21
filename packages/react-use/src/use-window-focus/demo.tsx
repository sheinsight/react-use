import { KeyValue, Section } from '@/components'
import { useWindowFocus } from '@shined/react-use'

export function App() {
  const isWinFocused = useWindowFocus()

  return (
    <Section>
      <KeyValue label="Is window focused" value={isWinFocused.toString()} />
    </Section>
  )
}
