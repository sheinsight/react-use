import { Card, Input, KeyValue } from '@/components'
import { useInputComposition } from '@shined/react-use'

export function App() {
  const composition = useInputComposition('#el-input')

  return (
    <Card>
      <KeyValue label="isComposing">{composition.isComposing}</KeyValue>
      <KeyValue label="Composition data">{composition.data}</KeyValue>
      <Input id="el-input" type="text" />
    </Card>
  )
}
