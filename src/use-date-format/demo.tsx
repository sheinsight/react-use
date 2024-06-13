import { Card, KeyValue, LabelInput, Zone } from '@/components'
import { useControlledComponent, useDateFormat, useNow } from '@shined/use'

export function App() {
  const now = useNow()
  const data = useDateFormat(now, 'YYYY-MM-DD • YYYY/MM/DD • YYYY.M.D • YYYY 年 M 月 D 日')
  const time = useDateFormat(now, 'HH:mm:ss • hh:mm:ss • H:m:s • h:m:s')

  const input = useControlledComponent('今天是 YYYY 年 M 月 D 日，dddd，现在是AA h 点 m 分 s 秒 SSS 毫秒。')

  const playground = useDateFormat(now, input.value, {
    locales: 'zh-CN',
    customMeridiem: (hours: number) => (hours < 12 ? '上午' : '下午'),
  })

  return (
    <Card>
      <Zone border="primary" row={false}>
        <KeyValue label="Formatted Date" value={data} />
        <KeyValue label="Formatted Time" value={time} />
      </Zone>
      <Zone border="primary" row={false}>
        <KeyValue label="Formatted Result" value={playground} />
        <LabelInput label="Format Template" className="flex-1" placeholder="Format Template" {...input.props} />
      </Zone>
    </Card>
  )
}
