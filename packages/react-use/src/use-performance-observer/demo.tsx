import { KeyValue, Section } from '@/components'
import { usePerformanceObserver } from '@shined/react-use'

const entryTypes = ['paint', 'paint', 'navigation', 'resource', 'mark', 'measure']

export function App() {
  const { observerRef, isSupported, ..._controls } = usePerformanceObserver(
    (entryList, observer) => {
      const records = observer.takeRecords()
      console.log(entryList.getEntries(), records)
    },
    { entryTypes },
  )

  return (
    <Section>
      <KeyValue label="isSupported" value={isSupported} />
      <KeyValue label="observerRef" value={observerRef.current ? 'ready' : 'not ready'} />
    </Section>
  )
}
