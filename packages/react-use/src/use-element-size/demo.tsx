import { Button, Card, CodeBlock } from '@/components'
import { useElementSize, useToggle } from '@shined/react-use'

export function App() {
  const [show, { toggle }] = useToggle(true)
  const { height, width } = useElementSize('#el-size')

  return (
    <Card>
      <Button onClick={toggle}>切换</Button>

      <CodeBlock lang="json">{JSON.stringify({ height, width }, null, 2)}</CodeBlock>

      {show && (
        <textarea
          id="el-size"
          disabled
          className="input-border w-80 h-40 rounded resize text-lg"
          defaultValue="try to resize the textarea to test this hook"
          onChange={() => {}} // Prevent React warning
        />
      )}
    </Card>
  )
}
