import { Button, Card } from '@/components'
import { useClipboardItems } from '@shined/use'

export function App() {
  const clipboard = useClipboardItems()

  const handleClick = () => {
    const textItem = new ClipboardItem({
      'text/plain': new Blob(['Hello world from useClipboardItems'], { type: 'text/plain' }),
    })

    clipboard.copy([textItem])
  }

  return (
    <Card>
      <Button disabled={clipboard.copied} onClick={handleClick}>
        {clipboard.copied ? 'Copied!' : 'Copy text item'}
      </Button>
    </Card>
  )
}
