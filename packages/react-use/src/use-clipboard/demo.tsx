import { Button, Input, KeyValue, Section } from '@/components'
import { useClipboard, useControlledComponent } from '@shined/react-use'

const hash = () => Math.random().toString(36).slice(2, 8).toUpperCase()

export function App() {
  const input = useControlledComponent(hash())
  const clipboard = useClipboard({ read: true })

  return (
    <Section>
      <KeyValue label="Clipboard content" value={clipboard.text} />

      <div className="flex gap-2">
        <Input {...input.props} />
        <Button disabled={clipboard.copied} onClick={() => !clipboard.copied && clipboard.copy(input.value)}>
          {clipboard.copied ? 'Copied!' : 'Copy text'}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => input.setValue(hash())}>Random text</Button>
        <Button onClick={clipboard.clear}>Empty clipboard</Button>
      </div>
    </Section>
  )
}
