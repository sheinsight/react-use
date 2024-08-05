import { Button, Card, cn } from '@/components'
import { useRequest } from './index'

export function App() {
  const { run, data, error, mutate, cancel, loadingSlow, loading, initializing, refreshing, ...pausable } = useRequest(
    async (name: string) => {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      return '[result]'
    },
    { loadingTimeout: 1200 },
  )

  // pausable.isActive
  // pausable.pause
  // pausable.resume

  return (
    <Card>
      <Button type="button" disabled={loading} onClick={() => run('jack')}>
        run
      </Button>
      <div className={loadingSlow ? 'text-amber' : ''}>
        {initializing && <div>initializing...</div>}
        {data && (
          <div className="flex gap-2">
            <div>{data}</div>
            <div>{refreshing && <span>(refreshing...)</span>}</div>
          </div>
        )}
        {!!error && <div>Error occurred!</div>}
      </div>
    </Card>
  )
}
