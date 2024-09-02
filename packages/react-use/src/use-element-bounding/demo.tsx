import { Card } from '@/components'
import { useElementBounding } from '@shined/react-use'

export function App() {
  const [bounding, _update] = useElementBounding('#el-bounding')

  return (
    <Card>
      <textarea
        id="el-bounding"
        disabled
        className="input-border w-100 h-80 rounded resize text-lg"
        value={JSON.stringify(bounding, null, 2)}
        onChange={() => {}} // Prevent React warning
      />
    </Card>
  )
}
