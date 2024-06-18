import { Card, KeyValue, Zone } from '@/components'
import { useBrowserMemory } from '@shined/react-use'

const size = (v: number) => `${(v / 1024 / 1024).toFixed(2)} MB`

export function App() {
  const memory = useBrowserMemory()

  return (
    <Card>
      <KeyValue labelWidth="120px" label="Supported" value={memory.isSupported} />
      <KeyValue labelWidth="120px" label="Timestamp" value={memory.timestamp} />

      <Zone row={false} width="300px" border="amber">
        <KeyValue labelWidth="120px" label="Used" value={size(memory.usedJSHeapSize)} />
        <KeyValue labelWidth="120px" label="Allocated" value={size(memory.totalJSHeapSize)} />
        <KeyValue labelWidth="120px" label="Limit" value={size(memory.jsHeapSizeLimit)} />
      </Zone>
    </Card>
  )
}
