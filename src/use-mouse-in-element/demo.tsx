import { Card, KeyValue, Zone } from '@/components'
import { useMouseInElement } from '@shined/react-use'

export function App() {
  const mouseInEl = useMouseInElement('#el-mouse-in-element')

  return (
    <Card>
      <KeyValue label="isOutside" value={mouseInEl.isOutside} />
      <Zone>
        <KeyValue label="elementX" value={mouseInEl.elementX} />
        <KeyValue label="elementY" value={mouseInEl.elementY} />
      </Zone>
      <Zone>
        <KeyValue label="elementPositionX" value={mouseInEl.elementPositionX} />
        <KeyValue label="elementPositionY" value={mouseInEl.elementPositionY} />
      </Zone>
      <Zone>
        <KeyValue label="elementHeight" value={mouseInEl.elementHeight} />
        <KeyValue label="elementWidth" value={mouseInEl.elementWidth} />
      </Zone>
      <div id="el-mouse-in-element" className="mt-2 size-120px rounded bg-red" />
    </Card>
  )
}
