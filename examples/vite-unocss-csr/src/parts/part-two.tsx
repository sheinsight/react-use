import { useEffect } from 'react'

import {
  useBattery,
  useBluetooth,
  useElementBounding,
  useElementByPoint,
  useEventListener,
  useMouse,
  useStyleTag,
  useTextDirection,
} from '@shined/react-use'

export const PartTwo = () => {
  const { x, y } = useMouse({ type: 'client' })
  const { element, isSupported, isActive, pause, resume } = useElementByPoint<false, HTMLElement>({ x, y })
  const [bounding, updateBounding] = useElementBounding(element)
  const [_, setDir] = useTextDirection()
  const { setCss } = useStyleTag('.awesome {color: red;}')
  const { update: updateBattery, ...battery } = useBattery()

  const {
    isConnected,
    isConnecting,
    isSupported: isBlueSupported,
    requestDevice,
    device,
    server,
  } = useBluetooth({ acceptAllDevices: true })

  useEventListener('scroll', updateBounding, true)

  return (
    <div>
      <pre>{JSON.stringify(battery, null, 2)}</pre>
      <button type="button" onClick={updateBattery}>
        update battery
      </button>

      <div>{isSupported ? 'nice' : 'oops'}</div>

      <div className="flex gap-2">
        <div className="w-20 h-20 bg-lime-6 rounded" />
        <div className="w-20 h-20 bg-lime-6 rounded" />
        <div className="w-20 h-20 bg-lime-6 rounded" />
        <div className="w-20 h-20 bg-lime-6 rounded" />
        <button type="button" onClick={isActive() ? () => pause(true) : () => resume(true)}>
          {isActive() ? 'Disable' : 'Enable'} useElementByPoint
        </button>
      </div>

      <div
        className="fixed rounded-sm transition-all duration-100 pointer-events-none bg-transparent"
        style={{
          left: `${bounding.left}px`,
          top: `${bounding.top}px`,
          width: `${bounding.width}px`,
          height: `${bounding.height}px`,
          backgroundColor: isActive() ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
          zIndex: isActive() ? 99999 : 'unset',
        }}
      />

      <div className={`w-120 h-80 rounded mb-2 ${isConnected ? 'bg-lime-6' : 'bg-red-5'}`}>
        <pre>{isBlueSupported ? 'bluetooth supported' : 'bluetooth not supported'}</pre>
        <pre>{isConnecting ? 'connecting...' : isConnected ? 'connected' : 'disconnected'}</pre>
        <pre>requested device: {device?.name ?? 'none'}</pre>
        <pre>server device: {server?.device.name ?? 'none'}</pre>
        <button type="button" onClick={requestDevice}>
          requestDevice
        </button>
        <button type="button" onClick={() => (isConnected ? server?.disconnect() : device?.gatt?.connect())}>
          {isConnected ? 'disconnect' : 'connect'}
        </button>
      </div>
    </div>
  )
}
