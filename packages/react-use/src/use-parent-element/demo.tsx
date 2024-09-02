import { Button, Card, Input, KeyValue, Zone } from '@/components'
import { useParentElement } from '@shined/react-use'

export function App() {
  const parentEl = useParentElement('#el-use-parent')
  const elStr = parentEl ? `${parentEl?.tagName.toLowerCase()}#${parentEl?.id}` : ''

  return (
    <Card>
      <KeyValue label="Parent Element" value={elStr} />
      <Zone id="parent" border="primary">
        Parent #parent
        <Zone id="el-use-parent" border="amber">
          Child #el-use-parent
        </Zone>
      </Zone>
    </Card>
  )
}
