import { Card, KeyValue, LabelInput, Zone } from '@/components'
import { useControlledComponent, useDateFormat, useNow } from '@shined/react-use'

export function App() {
  const now = useNow()
  const dateTime = useDateFormat(now, 'YYYY-MM-DD ddd HH:mm:ss.SSS')
  const unicodeDateTime = useDateFormat(now, 'yyyy-MM-dd eee HH:mm:ss.SSS', {
    unicodeSymbols: true,
  })

  const input = useControlledComponent('[Now is] YYYY-MM-DD ddd hh:mm:ss AA')
  const playground = useDateFormat(now, input.value)

  const unicodeInput = useControlledComponent('[Now is] yyyy-MM-dd eee HH:mm:ss aaaa')
  const unicodePlayground = useDateFormat(now, unicodeInput.value, { unicodeSymbols: true })

  return (
    <Card>
      <h3 className="mb-0">Convention Date Symbols (by default)</h3>
      <Zone border="primary" row={false}>
        <KeyValue labelWidth="60px" label="Format" value="YYYY-MM-DD ddd HH:mm:ss.SSS" />
        <KeyValue labelWidth="60px" label="Result" value={dateTime} />
      </Zone>
      <Zone border="primary" row={false}>
        <KeyValue labelWidth="80px" label="Result" value={playground} />
        <LabelInput labelWidth="80px" label="Template" className="flex-1" placeholder="Template" {...input.props} />
      </Zone>
      <h3 className="mb-0">Unicode Standard Date Symbols</h3>
      <Zone border="primary" row={false}>
        <KeyValue labelWidth="60px" label="Format" value="yyyy-MM-dd eee HH:mm:ss.SSS" />
        <KeyValue labelWidth="60px" label="Result" value={unicodeDateTime} />
      </Zone>
      <Zone border="primary" row={false}>
        <KeyValue labelWidth="80px" label="Result" value={unicodePlayground} />
        {/* biome-ignore format: no wrap */}
        <LabelInput labelWidth="80px" label="Template" className="flex-1" placeholder="Template" {...unicodeInput.props} />
      </Zone>
    </Card>
  )
}
