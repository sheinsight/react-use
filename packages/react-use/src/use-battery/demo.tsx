import { Card } from '@/components'
import { useBattery } from '@shined/react-use'

export function App() {
  const battery = useBattery()

  return (
    <Card>
      {!battery.isSupported && 'Your device does not support the Battery API.'}

      {battery.isSupported && (
        <div className={`w-full rounded mt-2 p-1 ${battery.charging ? 'bg-primary/36' : 'bg-amber-5/36'}`}>
          <div
            style={{ width: `${battery.level * 100}%` }}
            className={`h-12 flex items-center pl-4 font-bold text-white rounded ${battery.charging ? 'bg-primary/80' : 'bg-amber-5/80'}`}
          >
            Battery Level {battery.level * 100}% - Your device is {battery.charging ? 'charging...' : 'NOT charging.'}
          </div>
        </div>
      )}
    </Card>
  )
}
