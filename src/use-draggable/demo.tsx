import { Card } from '@/components'
import { useDraggable } from '@shined/react-use'

export function App() {
  const draggable = useDraggable('#drag-me', {
    initialValue: { x: 320, y: 320 },
    preventDefault: true,
  })

  const draggableInner = useDraggable('#drag-me-inner', {
    initialValue: { x: 10, y: 10 },
    preventDefault: true,
    containerElement: '#el-container',
  })

  const position = {
    x: Math.round(draggable.x),
    y: Math.round(draggable.y),
  }

  const positionInner = {
    x: Math.round(draggableInner.x),
    y: Math.round(draggableInner.y),
  }

  return (
    <Card>
      <div
        id="drag-me"
        style={draggable.style}
        className="z-99999999999 grid w-48 h-24 text-lg text-white rounded z-100 place-content-center cursor-grabbing bg-primary/80"
      >
        <div>{draggable.isDragging ? 'Yolo!!!' : 'Drag to move'}</div>
        <div>
          X: {position.x}, Y: {position.y}
        </div>
      </div>

      <div id="el-container" style={draggableInner.containerStyle} className="size-300px bg-amber/20 rounded">
        <div
          id="drag-me-inner"
          style={draggableInner.style}
          className="z-99999999999 grid w-48 h-24 text-lg text-white rounded z-100 place-content-center cursor-grabbing bg-primary/80"
        >
          <div>{draggableInner.isDragging ? 'Yolo (inner)!!!' : 'Drag to move (inner)'}</div>
          <div>
            X: {positionInner.x}, Y: {positionInner.y}
          </div>
        </div>
      </div>
    </Card>
  )
}
