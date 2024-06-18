import { Card, KeyValue } from '@/components'
import { useBattery } from '@shined/react-use'

export function App() {
  const battery = useBattery()

  return (
    <Card>
      <KeyValue label="Supported" value={battery.isSupported} />
      <KeyValue label="Charging" value={battery.charging} />
      <KeyValue label="Remaining capacity" value={battery.level * 100} suffix="%" />
      <KeyValue label="Charging seconds" value={battery.chargingTime} />
      <KeyValue label="Discharging seconds" value={battery.dischargingTime} />
    </Card>
  )
}
