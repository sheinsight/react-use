import { Button, Card, Input, KeyValue, Zone } from '@/components'
import { useFocusWithin } from '@shined/use'

export function App() {
  const isFocusWithin = useFocusWithin('#el-focus-within')

  return (
    <Card>
      <KeyValue label="Focused Within Amber Box" value={isFocusWithin} />
      <Zone id="el-focus-within" border="primary">
        {/* prettier-ignore */}
        <Zone>
          <Input placeholder="Type here" />
          <Button>Click me</Button>
        </Zone>
        {/* prettier-ignore */}
        <Zone>
          <Input placeholder="Type here" />
          <Button>Click me</Button>
        </Zone>
        {/* prettier-ignore */}
        <Zone>
          <Input placeholder="Type here" />
          <Button>Click me</Button>
        </Zone>
      </Zone>
      <Zone border="red">
        <Input placeholder="Type here" />
        <Button>Click me</Button>
      </Zone>
    </Card>
  )
}
