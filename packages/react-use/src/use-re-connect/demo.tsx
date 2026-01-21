import { Section, Toaster, toast } from '@/components'
import { useReConnect } from '@shined/react-use'

export function App() {
  useReConnect(() => {
    toast.success('Reconnected')
  })

  return (
    <Section>
      <div>This component will show a toast when the user reconnects to the internet.</div>
      <Toaster />
    </Section>
  )
}
