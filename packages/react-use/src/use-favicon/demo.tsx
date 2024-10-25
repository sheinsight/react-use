import { Button, Card, KeyValue, Zone } from '@/components'
import { useFavicon } from '@shined/react-use'

export function App() {
  const favicon = useFavicon()
  const href = favicon.href ? favicon.href.slice(0, 64) + (favicon.href.length > 64 ? '...' : '') : ''

  return (
    <Card>
      {favicon && <img src={favicon.href ?? ''} alt="icon" className="size-12 rounded" />}
      <KeyValue label="Favicon" value={href} />
      <Zone>
        <Button onClick={() => favicon.setFavicon('https://www.google.com/favicon.ico')}>Set Google favicon</Button>
        <Button onClick={() => favicon.setFavicon('https://www.facebook.com/favicon.ico')}>Set Facebook favicon</Button>
        <Button onClick={() => favicon.setEmojiFavicon('🪝')}>Set emoji favicon</Button>
        <Button onClick={() => favicon.setPreviousFavicon()}>Set previous favicon</Button>
      </Zone>
    </Card>
  )
}
