import { Button, Card, KeyValue, OTP, Zone, cn, wait } from '@/components'
import { useCounter, useRequest } from '@shined/react-use'

export function App() {
  return (
    <Card>
      <h3>Immediate + Trigger by user</h3>
      <Demo1 />
      <h3>Lifecycle + Refresh + Params + Mutate + Cancel</h3>
      <Demo2 />
      {/* <DemoFull /> */}
    </Card>
  )
}

function Demo1() {
  const { run, data, loading, error } = useRequest(wait)
  return (
    <>
      <KeyValue label="Data" value={error ? 'Error occurred!' : loading ? 'Loading...' : data ?? 'Not loaded'} />
      <Button mono disabled={loading} onClick={() => run()}>
        run()
      </Button>
    </>
  )
}

function Demo2() {
  const { run, mutate, refresh, params, cancel, data, loading } = useRequest((n = OTP()) => wait(300, n), {
    immediate: false,
    onBefore: (data, params) => console.log('onBefore', data, params),
    onSuccess: (data, params) => console.log('onSuccess', data, params),
    onFinally: (data, params) => console.log('onFinally', data, params),
    onMutate: (data, params) => console.log('onMutate', data, params),
    onCancel: (data, params) => console.log('onCancel', data, params),
  })

  return (
    <>
      <Zone>
        <KeyValue label="Data" value={data ?? 'Not loaded'} />
        <KeyValue label="Params" value={JSON.stringify(params)} />
      </Zone>
      <Zone>
        <Button mono disabled={loading} onClick={() => run()}>
          run()
        </Button>
        <Button mono disabled={loading} onClick={() => run(OTP())}>
          run(OTP())
        </Button>
        <Button mono disabled={!loading} onClick={() => cancel()}>
          cancel
        </Button>
        <Button mono onClick={() => mutate(OTP)}>
          mutate(OTP())
        </Button>
        <Button mono onClick={() => refresh()}>
          refresh()
        </Button>
      </Zone>
    </>
  )
}

function Demo4() {
  const { run, params, data, refresh, loading } = useRequest((n = OTP()) => wait(300, n), { immediate: false })

  return (
    <>
      <Zone>
        <KeyValue label="Data" value={data ?? 'Not loaded'} />
        <KeyValue label="Params" value={JSON.stringify(params)} />
      </Zone>
      <Zone>
        <Button mono disabled={loading} onClick={() => run()}>
          run()
        </Button>
        <Button mono disabled={loading} onClick={() => run(OTP())}>
          run(OTP())
        </Button>
        <Button mono disabled={loading} onClick={() => refresh()}>
          refresh
        </Button>
      </Zone>
    </>
  )
}

let _count = 0

function DemoFull() {
  const [count, actions] = useCounter(0)

  const { run, loading, loadingSlow, initializing, error, refreshing, data, cancel, mutate, resume, pause } =
    useRequest(
      async (name: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log(name)
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

  return (
    <>
      <Zone>
        <Button mono onClick={() => run(OTP())}>
          Run
        </Button>
        <Button mono disabled={!loading} onClick={() => cancel()}>
          Cancel
        </Button>
        <Button mono onClick={() => mutate('123')}>
          Mutate
        </Button>
        <Button mono onClick={() => actions.inc()}>
          Add DepCount
        </Button>
      </Zone>
      <Zone>
        <Button mono onClick={() => pause()}>
          Pause
        </Button>
        <Button mono onClick={() => resume()}>
          Resume
        </Button>
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
    </>
  )
}
