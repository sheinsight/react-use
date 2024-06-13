import { Button, Card, KeyValue, Zone } from '@/components'
import { useFullscreen, useStyleTag } from '@shined/use'

export function App() {
  // for demo purpose to make text more contrast
  useStyleTag(':fullscreen { background-color: var(--ifm-color-content-inverse) !important; }')

  return (
    <Card className="gap-4">
      <HtmlDemo />
      <ElementDemo />
    </Card>
  )
}

function ElementDemo() {
  const fsElement = useFullscreen('#el-fullscreen-element')

  return (
    <Zone border="primary" id="el-fullscreen-element" className="py-4 items-center justify-center">
      <div className="flex flex-col gap-4">
        <Zone className="justify-center gap-4">
          <KeyValue label="Is element fullscreen" value={fsElement.isFullscreen} />
        </Zone>
        <Zone className="justify-center gap-4">
          <Button disabled={fsElement.isFullscreen} onClick={() => fsElement.enter()}>
            Enter element fullscreen
          </Button>
          <Button disabled={!fsElement.isFullscreen} onClick={() => fsElement.exit()}>
            Exit element fullscreen
          </Button>
        </Zone>
      </div>
    </Zone>
  )
}

function HtmlDemo() {
  const fsHtml = useFullscreen()

  return (
    <Zone className="py-4 justify-center" border="blue">
      <Zone className="justify-center gap-4">
        <KeyValue label="Is `<HTML />` fullscreen" value={fsHtml.isFullscreen} />
      </Zone>
      <Zone className="justify-center gap-4">
        <Button disabled={fsHtml.isFullscreen} onClick={() => fsHtml.enter()}>
          Enter fullscreen
        </Button>
        <Button disabled={!fsHtml.isFullscreen} onClick={() => fsHtml.exit()}>
          Exit fullscreen
        </Button>
      </Zone>
    </Zone>
  )
}
