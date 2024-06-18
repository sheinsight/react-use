import { Button, Card, Input, KeyValue, Zone } from '@/components'
import { useFocus } from '@shined/react-use'

export function App() {
  const [inputFocused] = useFocus('#el-focus-input')

  const [iFocused, iActions] = useFocus('#el-focus-i', { initialValue: true })
  const [bFocused, bActions] = useFocus('#el-focus-b')
  const [pFocused, pActions] = useFocus('#el-focus-p')

  return (
    <Card>
      <Zone border="primary" row={false} className="mb-6">
        <div className="text-3xl">Welcome, {inputFocused ? '🙈' : '🐵'}</div>
        <Zone>
          <Input id="el-focus-input" defaultValue="admin" name="password" type="password" />
          <Button>Submit</Button>
        </Zone>
      </Zone>

      <Zone border="primary" row={false} className="mb-6">
        <KeyValue label="`#el-focus-i` Focused" value={iFocused} />
        <KeyValue label="`#el-focus-b` Focused" value={bFocused} />
        <KeyValue label="`#el-focus-p` Focused" value={pFocused} />
        <Zone border="amber">
          <Input id="el-focus-i" autoFocus placeholder="#el-focus-i" className="w-64" />
          <Button id="el-focus-b" className="w-64 transparent-border! focus:border-white/42!">
            #el-focus-b
          </Button>
          <p id="el-focus-p" className="m-0 w-64 transparent-border focus:border-primary/80">
            Paragraph <code>{'#el-focus-p'}</code>
          </p>
        </Zone>
        <Zone>
          <Button onClick={() => iActions.focus()}>Focus #el-focus-i</Button>
          <Button onClick={() => bActions.focus()}>Focus #el-focus-b</Button>
          <Button onClick={() => pActions.focus()}>Focus #el-focus-p</Button>
          <Button onClick={() => pActions.blur()}>Blur #el-focus-p</Button>
        </Zone>
      </Zone>
    </Card>
  )
}
