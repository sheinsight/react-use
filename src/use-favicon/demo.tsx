import { Button, Card, KeyValue, Zone } from '@/components'
import { useFavicon } from '@shined/react-use'

export function App() {
  const [favicon, actions] = useFavicon()
  const href = favicon ? favicon.slice(0, 64) + (favicon.length > 64 ? '...' : '') : ''

  return (
    <Card>
      {favicon && <img src={favicon} alt="icon" className="size-12 rounded" />}
      <KeyValue label="Favicon" value={href} />
      <Zone>
        <Button onClick={() => actions.setFavicon('https://www.google.com/favicon.ico')}>Set Google favicon</Button>
        <Button onClick={() => actions.setFavicon('https://www.facebook.com/favicon.ico')}>Set Facebook favicon</Button>
        <Button onClick={() => actions.setEmojiFavicon('🪝')}>Set emoji favicon</Button>
        <Button onClick={() => actions.setPreviousFavicon()}>Set previous favicon</Button>
      </Zone>
    </Card>
  )
}
