import { Card, Input, KeyValue, Zone } from '@/components'
import { useDateFormat, useGeolocation } from '@shined/use'

export function App() {
  const geo = useGeolocation()
  const date = useDateFormat(geo.locatedAt || Date.now(), 'HH:mm:ss', { fallback: 'null' })

  const borderColor = geo.isSupported ? (geo.isLocating ? 'amber' : 'primary') : 'red'

  return (
    <Card>
      <Zone>
        <KeyValue label="Is supported" value={geo.isSupported} />
        <KeyValue label="Is locating" value={geo.isLocating} />
        <KeyValue label="Located at" value={date} />
      </Zone>

      <Zone row={false} border={borderColor}>
        {geo.isSupported ? (
          geo.isLocating ? (
            <KeyValue label="Loading" value="true" />
          ) : (
            <>
              <KeyValue label="Latitude" value={geo.latitude} />
              <KeyValue label="Longitude" value={geo.longitude} />
            </>
          )
        ) : (
          <Input disabled value="Not supported" />
        )}
      </Zone>
    </Card>
  )
}
