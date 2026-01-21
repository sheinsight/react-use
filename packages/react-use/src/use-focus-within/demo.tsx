import { Button, Input, KeyValue, Section, Zone } from '@/components'
import { useFocusWithin } from '@shined/react-use'

export function App() {
  const isFocusWithin = useFocusWithin('#el-focus-within')

  return (
    <Section>
      <KeyValue label="Focused Within Amber Box" value={isFocusWithin} />
      <Zone id="el-focus-within" border="primary">
        {/* biome-ignore format: for demo */}
        <Zone><Input placeholder="Type here" /><Button>Click me</Button></Zone>
        {/* biome-ignore format: for demo */}
        <Zone><Input placeholder="Type here" /><Button>Click me</Button></Zone>
        {/* biome-ignore format: for demo */}
        <Zone><Input placeholder="Type here" /><Button>Click me</Button></Zone>
      </Zone>
      <Zone border="red">
        <Input placeholder="Type here" />
        <Button>Click me</Button>
      </Zone>
    </Section>
  )
}
