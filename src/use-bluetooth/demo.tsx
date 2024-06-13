import { Button, Card, Input, KeyValue, Zone } from '@/components'
import { useBluetooth, useControlledComponent, useSetState } from '@shined/use'
import { useEffect } from 'react'

export function App() {
  const prefixFilter = useControlledComponent('')
  const [info, setInfo] = useSetState({ battery: 0, model: '', manufacturer: '' })
  const extra = prefixFilter.value ? { filters: [{ namePrefix: prefixFilter.value }] } : {}

  const bluetooth = useBluetooth({
    acceptAllDevices: true,
    optionalServices: ['battery_service', 'device_information'],
    immediate: false,
    ...extra,
  })

  const canConnect = bluetooth.device?.name && !bluetooth.isConnecting && !bluetooth.isConnected

  useEffect(() => {
    if (bluetooth.isConnected && bluetooth.server) {
      bluetooth.server.getPrimaryService('battery_service').then((service) => {
        service.getCharacteristic('battery_level').then((characteristic) => {
          characteristic.readValue().then((value) => setInfo({ battery: value.getUint8(0) }))
        })
      })

      bluetooth.server.getPrimaryService('device_information').then((service) => {
        service.getCharacteristic('manufacturer_name_string').then((characteristic) => {
          characteristic.readValue().then((value) => {
            setInfo({ manufacturer: new TextDecoder('utf-8').decode(value) })
          })
        })

        service.getCharacteristic('model_number_string').then((characteristic) => {
          characteristic.readValue().then((value) => {
            setInfo({ model: new TextDecoder('utf-8').decode(value) })
          })
        })
      })
    }
  }, [bluetooth.isConnected, bluetooth.server])

  return (
    <Card>
      <Zone>
        <KeyValue label="Supported" value={bluetooth.isSupported} />
        <KeyValue label="Device name" value={bluetooth.device?.name ?? null} />
        <KeyValue label="Connected" value={bluetooth.isConnected} />
        <KeyValue label="Connecting" value={bluetooth.isConnecting} />
      </Zone>

      <Input {...prefixFilter.props} placeholder="Name Prefix of Device" />

      <div className="flex gap-2">
        <Button onClick={bluetooth.requestDevice}>Request devices</Button>
        <Button disabled={!canConnect} onClick={bluetooth.connect}>
          Connect
        </Button>
        <Button disabled={!bluetooth.isConnected} onClick={bluetooth.disconnect}>
          Disconnect
        </Button>
      </div>

      {info.battery > 0 && <pre>{JSON.stringify(info, null, 2)}</pre>}
    </Card>
  )
}
