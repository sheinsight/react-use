import { Card, KeyValue, Zone } from '@/components'
import { useMousePressed } from '@shined/use'

const boxCls = 'size-120px grid place-content-center rounded bg-red'

export function App() {
  const { pressed, sourceType } = useMousePressed()
  const targetPressed = useMousePressed('#el-mouse-pressed')

  return (
    <Card>
      <Zone row={false} border="primary">
        <KeyValue label="Mouse Pressed" value={pressed} />
        <KeyValue label="Source Type" value={sourceType} />
      </Zone>
      <Zone row={false} border="amber">
        <KeyValue label="Mouse Pressed (target)" value={targetPressed.pressed} />
        <KeyValue label="Source Type (target)" value={targetPressed.sourceType} />
      </Zone>
      <div id="el-mouse-pressed" className={boxCls}>
        Target
      </div>
    </Card>
  )
}
