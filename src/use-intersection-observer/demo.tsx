import { Card, KeyValue, Zone } from '@/components'
import { useIntersectionObserver, useSafeState } from '@shined/react-use'

const threshold = [0, 0.25, 0.5, 0.75, 1]
const targetCls = 'my-2 h-32 p-2 bg-primary/80 text-white rounded grid place-content-center'

export function App() {
  const [isIntersecting, setIsIntersecting] = useSafeState(false)
  const [intersectionRatio, setIntersectionRatio] = useSafeState(0)

  const callback: IntersectionObserverCallback = ([entry]) => {
    console.log('callback triggered!')
    setIsIntersecting(entry.isIntersecting)
    setIntersectionRatio(entry.intersectionRatio)
  }

  useIntersectionObserver('#el-intersection', callback, { threshold })

  return (
    <Card>
      <Zone>
        <KeyValue label="isIntersecting" value={isIntersecting} />
        <KeyValue label="intersectionRatio" value={intersectionRatio} />
      </Zone>
      <div className="w-320px h-48 bg-#666666/20 rounded overflow-scroll p-2">
        <div className="h-60 p-2 bg-amber/60 text-white rounded" />
        <div id="el-intersection" className={targetCls}>
          {isIntersecting ? 'Intersecting' : 'Not intersecting'}
          {isIntersecting && ` (${(intersectionRatio * 100).toFixed(2)}%)`}
        </div>
        <div className="h-60 p-2 bg-amber/60 text-white rounded" />
      </div>
    </Card>
  )
}
