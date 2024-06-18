import { Button, Card, Input, Zone } from '@/components'
import { useStyleTag } from '@shined/react-use'

const initialCss = '#el-style-tag { background: skyblue; }'

export function App() {
  const { load, unload, setCss, css } = useStyleTag(initialCss, { manual: true })

  return (
    <Card>
      <div id="el-style-tag" className="bg-amber/80 rounded size-120px grid place-content-center">
        #el-style-tag
      </div>
      <Input className="w-100%" value={css} onChange={(e) => setCss(e.target.value)} />
      <Zone>
        <Button onClick={load}>Load</Button>
        <Button onClick={unload}>Unload</Button>
      </Zone>
    </Card>
  )
}
