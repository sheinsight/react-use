import { Card, KeyValue, Zone, wait as mockFetch } from '@/components'
import { generateLoremIpsum, useInfiniteScroll, useSafeState } from '@shined/use'

export function App() {
  const [list, setList] = useSafeState<{ idx: number; text: string }[]>([])

  const fetchData = async () => {
    await mockFetch(Math.random() * 600 + 200)

    const newData = Array.from({ length: 20 }, (_, i) => ({
      idx: list.length + (i + 1),
      text: generateLoremIpsum(),
    }))

    setList([...list, ...newData])

    return newData
  }

  const scroll = useInfiniteScroll('#el-infinite-scroll', fetchData, {
    canLoadMore: (pre) => (!pre ? true : pre[pre.length - 1].idx <= 100),
  })

  return (
    <Card>
      <Zone>
        <KeyValue label="isLoading" value={scroll.isLoading} />
        <KeyValue label="isLoadDone" value={scroll.isLoadDone} />
      </Zone>
      <div id="el-infinite-scroll" className="w-full h-80 bg-#666666/20 rounded overflow-scroll p-4">
        {list.map((item) => (
          <div key={item.idx} className="my-2 p-2 bg-primary/40 dark:text-white rounded">
            {item.text}
          </div>
        ))}
        {scroll.isLoading && <div className="text-center my-1 py-1 dark:text-white animate-pulse">Loading...</div>}
        {scroll.isLoadDone && <div className="text-center my-1 py-1 dark:text-white">No more data</div>}
      </div>
    </Card>
  )
}
