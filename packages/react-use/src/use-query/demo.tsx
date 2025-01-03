import { Button, Card, KeyValue, OTP, Toaster, Zone, cn, toast, wait } from '@/components'
import { mutate, useCounter, useQuery } from '@shined/react-use'

export function App() {
  return (
    <Card>
      <h3 className="font-bold text-xl">Immediate + Trigger by user + Dependencies</h3>
      <Demo1 />
      <h3 className="font-bold text-xl">Lifecycle + Refresh + Params + Mutate + Cancel</h3>
      <Demo2 />
      <h3 className="font-bold text-xl">Throttle + Debounce</h3>
      <Demo3 />
      <h3 className="font-bold text-xl">ReFocus + ReConnect + AutoRefresh + Loading Slow</h3>
      <Demo4 />
      <h3 className="font-bold text-xl">Error Retry + Cache (SWR)</h3>
      <Demo5 />
      <Toaster />
    </Card>
  )
}

function Demo1() {
  const [count, actions] = useCounter(0)
  const { run, data, loading, error } = useQuery(wait, { refreshDependencies: [count] })

  return (
    <>
      <KeyValue label="Data" value={error ? 'Error!' : loading ? 'Loading...' : (data ?? 'Not loaded')} />
      <Zone>
        {data}
        <Button mono onClick={() => run()}>
          run()
        </Button>
        <Button mono onClick={() => actions.inc()}>
          actions.inc()
        </Button>
      </Zone>
    </>
  )
}

function Demo2() {
  const { run, mutate, initializing, refresh, refreshing, params, cancel, data, loading } = useQuery(
    (n = OTP()) => wait(300, n),
    {
      immediate: false,
      cacheKey: 'cacheKeyForDemo5',
      onBefore: (data, params) => console.log('onBefore', data, params),
      onSuccess: (data, params) => console.log('onSuccess', data, params),
      onFinally: (data, params) => console.log('onFinally', data, params),
      onMutate: (data, params) => console.log('onMutate', data, params),
      onCancel: (data, params) => console.log('onCancel', data, params),
      onRefresh: (data, params) => console.log('onRefresh', data, params),
    },
  )

  return (
    <>
      <Zone>
        <KeyValue
          label="Data"
          value={initializing ? 'Initializing...' : (data ?? 'Not loaded')}
          valueClassName={cn(refreshing ? 'opacity-60' : '')}
        />
        <KeyValue label="Params" value={JSON.stringify(params)} valueClassName={cn(refreshing ? 'opacity-60' : '')} />
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
        <Button mono onClick={() => mutate(OTP())}>
          mutate(data)
        </Button>
        <Button mono onClick={() => mutate((data, _params) => [data ? `${data}.` : data, [222]])}>
          mutate((d, p) =&gt; [d, p])
        </Button>
        <Button mono onClick={() => refresh()}>
          refresh()
        </Button>
      </Zone>
    </>
  )
}

function Demo3() {
  const { run, data, loading, error } = useQuery(wait, { immediate: false, debounce: 300 })
  const {
    run: run2,
    data: data2,
    loading: loading2,
    error: error2,
  } = useQuery(wait, { immediate: false, throttle: 1000 })
  return (
    <>
      <Zone>
        <KeyValue
          label="Data with debounce"
          value={error ? 'Error!' : loading ? 'Loading...' : (data ?? 'Not loaded')}
        />
        <KeyValue
          label="Data with throttle"
          value={error2 ? 'Error!' : loading2 ? 'Loading...' : (data2 ?? 'Not loaded')}
        />
      </Zone>
      <Zone>
        <Button mono onClick={() => run()}>
          run() with debounce
        </Button>
        <Button mono onClick={() => run2()}>
          run() with throttle
        </Button>
      </Zone>
    </>
  )
}

function Demo4() {
  const { data, initializing, loadingSlow } = useQuery((n = OTP()) => wait(1000, n), {
    // refreshInterval: 6000,
    refreshOnFocus: true,
    refreshOnReconnect: true,
    loadingTimeout: 500,
  })

  const slowStr = loadingSlow ? ' (slow...)' : ''

  return <KeyValue label="Data" value={initializing ? 'Initializing...' : data ? `${data}${slowStr}` : 'Not loaded'} />
}

const _localStorageProvider = {
  get: (key: string) => {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : undefined
  },
  set: (key: string, value: string) => localStorage.setItem(key, JSON.stringify(value)),
  delete: (key: string) => localStorage.removeItem(key),
  keys: () => Object.keys(localStorage)[Symbol.iterator](),
}

let fetchCount = 0

function Demo5() {
  const fetch = useQuery(
    async (n = OTP()) => {
      fetchCount += 1
      const res = await wait(1000, n)
      if (fetchCount <= 1) throw new Error('Error!')
      return res
    },
    {
      immediate: false,
      cacheKey: 'cacheKeyForDemo5',
      // provider: localStorageProvider,
      errorRetryCount: 3,
      onErrorRetry: (error, { currentCount }) => toast.loading(`Retry ${currentCount} times ...`, { id: 'retry' }),
      onSuccess: (data, _params) => toast.success(`Success! ${data}`, { id: 'retry' }),
    },
  )

  const fetch2 = useQuery((n = OTP()) => wait(1000, n), {
    immediate: false,
    cacheKey: 'cacheKeyForDemo5',
    // provider: localStorageProvider,
  })

  const slowStr = fetch.loadingSlow ? ' (slow...)' : ''

  return (
    <>
      <Zone>
        <KeyValue label="Data" value={fetch.data ? `${fetch.data}${slowStr}` : 'Not loaded'} />
        <KeyValue label="Params" value={JSON.stringify(fetch.params)} />
      </Zone>
      <Zone>
        <KeyValue label="Data2" value={fetch2.data ? `${fetch2.data}${slowStr}` : 'Not loaded'} />
        <KeyValue label="Params2" value={JSON.stringify(fetch2.params)} />
      </Zone>
      <Zone>
        <Button mono disabled={fetch.loading} onClick={() => fetch.run()}>
          run()
        </Button>
        <Button mono disabled={fetch.loading} onClick={() => fetch.refresh()}>
          refresh()
        </Button>
        <Button mono disabled={fetch.loading} onClick={() => fetch.run(OTP())}>
          run(OTP())
        </Button>
      </Zone>
      <Zone>
        <Button mono disabled={fetch2.loading} onClick={() => fetch2.run()}>
          run2()
        </Button>
        <Button mono disabled={fetch2.loading} onClick={() => fetch2.refresh()}>
          refresh2()
        </Button>
        <Button mono disabled={fetch2.loading} onClick={() => fetch2.run(OTP())}>
          run2(OTP())
        </Button>
      </Zone>
      <Button mono disabled={fetch2.loading} onClick={() => mutate(() => true, '99999', ['dddd'])}>
        mutateGlobal
      </Button>
    </>
  )
}
