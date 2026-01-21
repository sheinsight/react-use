import { Section } from '@/components'
import { useElementSize } from '@shined/react-use'

export function App() {
  const { height, width } = useElementSize('#el-size')

  return (
    <Section>
      <textarea
        id="el-size"
        disabled
        className="input-border w-80 h-40 rounded resize text-lg"
        value={JSON.stringify({ height, width }, null, 2)}
        onChange={() => {}} // Prevent React warning
      />
    </Section>
  )
}
