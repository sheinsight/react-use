import { Card, KeyValue, LabelInput, Zone } from '@/components'
import { useControlledComponent, useDateFormat, useNow } from '@shined/react-use'

export function App() {
  const now = useNow()
  const data = useDateFormat(now, 'YYYY-MM-DD • YYYY/MM/DD • YYYY.M.D • YYYY MMMM D, YYYY')
  const time = useDateFormat(now, 'HH:mm:ss • hh:mm:ss • H:m:s • h:m:s')
  const input = useControlledComponent("[Today is] M/D/YYYY, ddd, [now is] A H [o'clock] m [min] s [sec] SSS [ms]")

  const playground = useDateFormat(now, input.value, { locales: 'en-US' })

  return (
    <Card>
      <Zone border="primary" row={false}>
        <KeyValue label="Date" value={data} />
        <KeyValue label="Time" value={time} />
      </Zone>
      <Zone border="primary" row={false}>
        <KeyValue label="Render Result" value={playground} />
        {/* Offers a flexible input for custom date-time formatting */}
        <LabelInput label="Template" className="flex-1" placeholder="Template" {...input.props} />
      </Zone>
    </Card>
  )
}
