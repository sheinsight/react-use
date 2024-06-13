import { Button, Card, KeyValue, Zone } from '@/components'
import { useCssVar, useLoremIpsum } from '@shined/use'

const random256 = () => Math.floor(Math.random() * 256)
const randomColor = () => `rgb(${random256()}, ${random256()}, ${random256()})`

export function App() {
  const lorem = useLoremIpsum()

  const [value, _setValue] = useCssVar('--ifm-background-color', { observe: true })
  const [variable, setVariable] = useCssVar('--color', { defaultValue: 'skyblue' })

  return (
    <Card>
      <KeyValue label="`--ifm-background-color`" value={value} />
      <Zone border="primary" row={false}>
        <KeyValue label="`--color` of `<html>`" value={variable} />
        <div style={{ color: 'var(--color)' }}>{lorem}</div>
        <Zone>
          <Button onClick={() => setVariable(randomColor())}>Set random color</Button>
        </Zone>
      </Zone>
    </Card>
  )
}
