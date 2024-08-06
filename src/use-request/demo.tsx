import { Button, Card, OTP, Zone, cn } from '@/components'
import { useCounter, useRequest } from '@shined/react-use'

let _count = 0

export function App() {
  const [count, actions] = useCounter(0)

  const { run, loading, loadingSlow, initializing, error, refreshing, data, cancel, mutate, resume, pause } =
    useRequest(
      async (name: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return `[result: ${name ?? 'no-name'}]`
      },
      {
        initialData: 'initialData',
        loadingTimeout: 600,
        onBefore: () => console.log('onBefore'),
        onSuccess: (data) => console.log('onSuccess', data),
        onError: (error) => console.log('onError', error),
        onFinally: (data) => console.log('onFinally', data),
        refreshOnFocus: true,
        refreshOnReconnect: true,
        refreshInterval: 5_000,
        refreshOnFocusThrottleWait: 3000,
        refreshDependencies: [count],
      },
    )

  console.log('render', ++_count)

  // pausable.isActive
  // pausable.pause
  // pausable.resume

  return (
    <Card>
      <Zone>
        <Button onClick={() => run(OTP())}>Run</Button>
        <Button disabled={!loading} onClick={() => cancel()}>
          Cancel
        </Button>
        <Button onClick={() => mutate('123')}>Mutate</Button>
        <Button onClick={() => actions.inc()}>Add DepCount</Button>
      </Zone>
      <Zone>
        <Button onClick={() => pause()}>Pause</Button>
        <Button onClick={() => resume()}>Resume</Button>
      </Zone>
      <div className={loadingSlow ? 'text-amber' : ''}>
        {initializing && <div>initializing... {loadingSlow ? '(loading slow...)' : ''}</div>}
        {data && (
          <div className="flex gap-2">
            <div>{data}</div>
            <div>{refreshing && <span>({loadingSlow ? 'loading slow...' : 'refreshing...'})</span>}</div>
          </div>
        )}
        {!!error && <div>Error occurred!</div>}
      </div>
    </Card>
  )
}
