import { Button, Card, KeyValue, Zone } from '@/components'
import { useElementBounding, useElementByPoint, useMouse, useStyleTag } from '@shined/use'

export function App() {
  const { x, y, ...mouseControls } = useMouse({ type: 'client' })
  const { isSupported, element, ...controls } = useElementByPoint({ x, y })

  const [bounding] = useElementBounding(element as HTMLElement | null)
  const styleTag = useStyleTag('* { cursor: crosshair !important; }')
  const isActive = mouseControls.isActive() && controls.isActive()

  const pause = () => {
    styleTag.unload()
    mouseControls.pause()
    controls.pause(true)
  }

  const resume = () => {
    styleTag.load()
    mouseControls.resume()
    controls.resume(true)
  }

  const lineCls = 'fixed pointer-events-none bg-amber/80 z-9999'

  return (
    <Card>
      <Zone>
        <KeyValue label="Supported" value={isSupported} />
        <KeyValue label="isActive" value={isActive} />
      </Zone>
      <Zone>
        <KeyValue label="Selected Element" value={`<${element?.tagName.toLowerCase()} />`} />
        <KeyValue label="Mouse Position" value={`(${x}, ${y})`} />
      </Zone>
      <Zone>
        <Button disabled={!isActive} onClick={pause}>
          Pause
        </Button>
        <Button disabled={isActive} onClick={resume}>
          Resume
        </Button>
      </Zone>

      <div
        className="fixed rounded-sm transition-all duration-200 pointer-events-none bg-transparent ease-out"
        style={{
          left: `${bounding.left}px`,
          top: `${bounding.top}px`,
          width: `${bounding.width}px`,
          height: `${bounding.height}px`,
          backgroundColor: controls.isActive() ? 'rgb(46 133 85 / 0.24)' : 'transparent',
          zIndex: controls.isActive() ? 9999999 : 'unset',
        }}
      />
      <div className={lineCls} style={{ left: x, top: 0, width: controls.isActive() ? 1 : 0, height: '100%' }} />
      <div className={lineCls} style={{ left: 0, top: y, width: '100%', height: controls.isActive() ? 1 : 0 }} />
    </Card>
  )
}
