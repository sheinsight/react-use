import { Card } from '@/components'
import { useResizeObserver, useSafeState } from '@shined/react-use'

export function App() {
  const [state, setState] = useSafeState('')

  useResizeObserver('#el-resize-observer', (entries, _observer) => {
    const { height = 0, width = 0 } = entries[0]?.contentRect || {}
    setState(JSON.stringify({ height, width }, null, 2))
  })

  return (
    <Card>
      <textarea
        id="el-resize-observer"
        disabled
        value={state}
        onChange={() => {}}
        className="h-160px p-2 text-4 input-border text-pretty"
      />
    </Card>
  )
}
