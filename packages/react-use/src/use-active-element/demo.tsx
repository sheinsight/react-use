import { Button, Input, KeyValue, Section, Zone } from '@/components'
import { useActiveElement } from '@shined/react-use'

export function App() {
  const activeElement = useActiveElement()

  const tagName = activeElement?.tagName.toLowerCase()
  const value = tagName ? `<${tagName} />` : 'null'

  return (
    <Section>
      <KeyValue label="Active element" value={value} />

      <Zone>
        <Input placeholder="Click here to test" />
        <Button>Also press here</Button>
      </Zone>
    </Section>
  )
}
