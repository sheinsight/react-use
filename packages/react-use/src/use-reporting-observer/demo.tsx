import { Section } from '@/components'
import { useReportingObserver } from '@shined/react-use'

export function App() {
  useReportingObserver((reports, _observer) => {
    console.log(reports)
  })

  return <Section>See log in console for reports</Section>
}
