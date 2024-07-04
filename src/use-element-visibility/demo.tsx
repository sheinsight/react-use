import { Card, KeyValue } from '@/components'
import { useElementVisibility } from '@shined/react-use'

export function App() {
  const visibility = useElementVisibility('#el-visibility')

  return (
    <Card className="text-white">
      <KeyValue label="Element visibility" value={visibility} />
      <div className="h-32 rounded overflow-scroll">
        <div className="h-48 w-80 bg-primary/60 grid place-content-center">Scroll down to see visibility</div>
        {/* biome-ignore format: no wrap */}
        <div id="el-visibility" className="w-80 h-36 bg-primary/80 grid place-content-center">I'm the target element</div>
        <div className="h-48 w-80 bg-primary/60 grid place-content-center">The visibility will be false</div>
      </div>
    </Card>
  )
}
