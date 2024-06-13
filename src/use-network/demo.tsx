import { Card, KeyValue, Zone } from '@/components'
import { useNetwork } from '@shined/use'

export function App() {
  const network = useNetwork()

  return (
    <Card>
      <Zone>
        <KeyValue label="Is online">{network.isOnline}</KeyValue>
        <KeyValue label="Effective type">{network.effectiveType}</KeyValue>
        <KeyValue label="RTT">{network.rtt}</KeyValue>
        <KeyValue label="Downlink">{network.downlink}</KeyValue>
      </Zone>
    </Card>
  )
}
