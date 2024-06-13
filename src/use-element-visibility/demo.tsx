import { Card, KeyValue } from '@/components'
import { useElementVisibility } from '@shined/use'

export function App() {
  const visibility = useElementVisibility('#el-visibility')

  return (
    <Card>
      <KeyValue label="Element visibility" value={visibility} />
      <div className="h-24 rounded overflow-scroll border border-dashed border-amber/80">
        <div className="h-36 w-80 bg-primary/20 grid place-content-center">Scroll down to see visibility</div>
        <div id="el-visibility" className="text-white w-80 h-20 bg-primary/80 grid place-content-center">
          I'm the target element
        </div>
        <div className="h-36 w-80 bg-primary/20 grid place-content-center">The visibility will be false</div>
      </div>
    </Card>
  )
}
