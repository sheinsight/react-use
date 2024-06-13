import { Button, Card, KeyValue, Zone } from '@/components'
import { useWindowScroll } from '@shined/use'

export function App() {
  const scroll = useWindowScroll({ behavior: 'smooth' })

  return (
    <Card>
      <KeyValue label="(X, Y)" value={`(${scroll.x}, ${scroll.y})`} />
      <KeyValue label="(maxX, maxY)" value={`(${scroll.maxX}, ${scroll.maxY})`} />
      <Button onClick={() => scroll.scrollTo({ x: 160, y: 160 })}>Scroll to (160, 160)</Button>
      <Zone>
        <Button disabled={scroll.y === scroll.maxY} onClick={() => scroll.scrollToBottom()}>
          Scroll to bottom
        </Button>
        <Button disabled={scroll.y === 0} onClick={() => scroll.scrollToTop()}>
          Scroll to top
        </Button>
        <Button disabled={scroll.x === scroll.maxX} onClick={() => scroll.scrollToRight()}>
          Scroll to right
        </Button>
        <Button disabled={scroll.x === 0} onClick={() => scroll.scrollToLeft()}>
          Scroll to left
        </Button>
      </Zone>
      <div className="opacity-0 w-[calc(100vw+320px)] h-0">horizontal scroll helper</div>
    </Card>
  )
}
