import { Card, KeyValue, LabelInput, Zone } from '@/components'
import { useControlledComponent, useDateFormat, useNow } from '@shined/react-use'

export function App() {
  const now = useNow()

  const dateTime = useDateFormat(now, 'YYYY-MM-DD dddd HH:mm:ss.SSS')
  const input = useControlledComponent('[Now is] YYYY-MM-DD dddd hh:mm:ss AA')
  const playground = useDateFormat(now, input.value)

  const unicodeDateTime = useDateFormat(now, 'yyyy-MM-dd eeee HH:mm:ss.SSS', { unicodeSymbols: true })
  const unicodeInput = useControlledComponent('[Now is] yyyy-MM-dd eeee HH:mm:ss aaaa')
  const unicodePlayground = useDateFormat(now, unicodeInput.value, { unicodeSymbols: true })

  return (
    <Card>
      <h3 className="mb-0">Convention Date Symbols (by default)</h3>
      <Zone border="primary" row={false}>
        <KeyValue label="Format" value="YYYY-MM-DD ddd HH:mm:ss.SSS" />
        <KeyValue label="Result" value={dateTime} />
      </Zone>
      <Zone border="primary" row={false}>
        <KeyValue label="Result" value={playground} />
        <LabelInput label="Template" className="flex-1" {...input.props} />
      </Zone>
      <h3 className="mb-0">Unicode Standard Date Symbols</h3>
      <Zone border="primary" row={false}>
        <KeyValue label="Format" value="yyyy-MM-dd eee HH:mm:ss.SSS" />
        <KeyValue label="Result" value={unicodeDateTime} />
      </Zone>
      <Zone border="primary" row={false}>
        <KeyValue label="Result" value={unicodePlayground} />
        <LabelInput label="Template" className="flex-1" {...unicodeInput.props} />
      </Zone>
    </Card>
  )
}
