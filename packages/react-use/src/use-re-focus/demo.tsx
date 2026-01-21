import { Section, Toaster, toast } from '@/components'
import { useReFocus } from '@shined/react-use'

export function App() {
  useReFocus(
    () => {
      toast.success('Refocused')
    },
    { wait: 6000 },
  )

  return (
    <Section>
      <div>This component will show a toast when the user refocuses on the window.</div>
      <Toaster />
    </Section>
  )
}
