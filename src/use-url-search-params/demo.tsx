import { Button, Card, KeyValue, OTP, Zone } from '@/components'
import { useUrlSearchParams } from '@shined/react-use'

export function App() {
  const [usp, setUsp, clearUsp] = useUrlSearchParams('history', {
    initialValue: {
      mode: 'mode' as undefined | string,
      val: ['val'] as string[],
    },
  })

  const [hUsp, setHUsp, clearHUsp] = useUrlSearchParams('hash')
  const [hpUsp, setHpUsp, clearHpUsp] = useUrlSearchParams('hash-params')

  return (
    <Card>
      <Zone border="primary">
        <KeyValue label="Params (history)" value={JSON.stringify(usp, null, 0)} />
        <Zone>
          <Button onClick={() => setUsp({ mode: 'history' })}>Set mode</Button>
          <Button onClick={() => setUsp({ val: ['foo', OTP()] })}>Set array val</Button>
          <Button onClick={clearUsp}>Clear</Button>
        </Zone>
      </Zone>

      <Zone border="primary">
        <KeyValue label="Params (hash)" value={JSON.stringify(hUsp, null, 0)} />
        <Zone>
          <Button onClick={() => setHUsp({ mode: 'hash' })}>Set mode</Button>
          <Button onClick={() => setHUsp({ hVal: ['foo', OTP()] })}>Set array val</Button>
          <Button onClick={clearHUsp}>Clear</Button>
        </Zone>
      </Zone>

      <Zone border="primary">
        <KeyValue label="Params (hash-params)" value={JSON.stringify(hpUsp, null, 0)} />
        <Zone>
          <Button onClick={() => setHpUsp({ mode: 'hash-params' })}>Set mode</Button>
          <Button onClick={() => setHpUsp({ hpVal: ['foo', OTP()] })}>Set array val</Button>
          <Button onClick={clearHpUsp}>Clear</Button>
        </Zone>
      </Zone>
    </Card>
  )
}
