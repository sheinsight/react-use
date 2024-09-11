import { Button, Card, KeyValue, Zone, cn, wait as mockFetch } from '@/components'
import { generateLoremIpsum, useInfiniteScroll, useSafeState, useVersionedAction } from '@shined/react-use'
import { useRef } from 'react'

export function App() {
  const ref = useRef<HTMLDivElement>(null)
  const [list, setList] = useSafeState<{ idx: number; text: string }[]>([])
  const [incVersion, runVersionedAction] = useVersionedAction()

  const fetchData = async () => {
    const version = incVersion()

    await mockFetch(1000)

    return await runVersionedAction(version, async () => {
      const newData = Array.from({ length: 20 }, (_, i) => ({
        idx: list.length + (i + 1),
        text: generateLoremIpsum(),
      }))

      setList([...list, ...newData])

      return newData
    })
  }

  const infiniteScroll = useInfiniteScroll(ref, fetchData, {
    canLoadMore: (pre) => {
      return pre ? pre[pre.length - 1].idx <= 100 : true
    },
  })

  const reset = () => {
    incVersion()
    setList([])
    infiniteScroll.reset()
  }

  return (
    <Card>
      <Zone>
        <KeyValue label="Loading" value={infiniteScroll.loading} />
        <KeyValue label="isLoadDone" value={infiniteScroll.isLoadDone} />
        <KeyValue label="Item Count" value={list.length} />
      </Zone>
      <div
        ref={ref}
        className={cn(
          'w-full h-80 bg-#666666/20 rounded overflow-scroll p-4 transition-all',
          infiniteScroll.loading ? 'opacity-60' : '',
        )}
      >
        {list.map((item) => (
          <div key={item.idx} className="my-2 p-2 bg-primary/40 dark:text-white rounded">
            {item.text}
          </div>
        ))}
        {infiniteScroll.loading && (
          <div className="text-center my-1 py-1 dark:text-white animate-pulse">Loading...</div>
        )}
        {infiniteScroll.isLoadDone && <div className="text-center my-1 py-1 dark:text-white/60">No more data</div>}
      </div>
      <Button onClick={reset}>Reset List</Button>
    </Card>
  )
}
