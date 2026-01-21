import { KeyValue, Section } from '@/components'
import { useHover } from '@shined/react-use'

export function App() {
  const isHovered = useHover('#el-hover')

  const bgColor = isHovered ? 'bg-primary/60' : 'bg-red/60'

  return (
    <Section>
      <KeyValue label="isHovered">{isHovered}</KeyValue>
      <div id="el-hover" className={`w-36 h-24 rounded grid place-content-center ${bgColor}`}>
        {isHovered ? 'Nice try 👍' : 'Hover me 😭'}
      </div>
    </Section>
  )
}
