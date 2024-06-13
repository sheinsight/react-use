import { Button, Card, KeyValue, Zone } from '@/components'
import { useDeviceList } from '@shined/use'

export function App() {
  const device = useDeviceList({ requestPermissions: true })

  return (
    <Card>
      <KeyValue label="Permission granted" value={device.isPermissionGranted} />
      {!device.isPermissionGranted && <Button onClick={device.ensurePermission}>Request permission</Button>}
      {device.isPermissionGranted && device.devices.length > 0 ? (
        <Zone row={false} border="amber">
          {device.devices.map((device, index) => {
            const value = `${device.kind} - ${device.deviceId.slice(0, 16).toUpperCase()}`
            // biome-ignore lint/suspicious/noArrayIndexKey: for demo
            return <KeyValue key={index} label={device.label} value={value} />
          })}
        </Zone>
      ) : (
        <KeyValue label="Devices" value="No devices found" />
      )}
    </Card>
  )
}
