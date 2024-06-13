import { Button, Card, KeyValue, Zone } from '@/components'
import { useEyeDropper } from '@shined/use'

export function App() {
  const eyeDropper = useEyeDropper({ initialValue: '#33AAFF' })
  const shouldTextBlack = Number.parseInt(eyeDropper.sRGBHex.slice(1), 16) > 0xffffff / 2

  return (
    <Card>
      <Zone>
        <KeyValue label="isSupported" value={eyeDropper.isSupported} />
        <KeyValue label="sRGBHex" value={eyeDropper.sRGBHex} />
      </Zone>
      <Button onClick={() => eyeDropper.open()} disabled={!eyeDropper.isSupported}>
        {eyeDropper.isSupported ? 'Open EyeDropper' : 'EyeDropper is not supported'}
      </Button>
      <div
        className="w-60 h-36 font-bold rounded grid place-content-center"
        style={{
          backgroundColor: eyeDropper.sRGBHex,
          color: shouldTextBlack ? 'black' : 'white',
          border: `2px dashed ${shouldTextBlack ? 'black' : 'white'}`,
        }}
      >
        Color Preview Here
      </div>
    </Card>
  )
}
