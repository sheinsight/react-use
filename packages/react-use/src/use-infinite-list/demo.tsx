import { Card, KeyValue, Zone, wait } from '@/components'
import { useInfiniteList } from '@shined/react-use'
import { useRef } from 'react'

interface Item {
  id: number
  name: string
}

export function App() {
  const ref = useRef<HTMLDivElement>(null)

  const infiniteList = useInfiniteList<
    { data: Item[]; total: number },
    { name: string; gender: string; color: string[] }
  >({
    target: ref,
    fetcher: fetchPagination,
    canLoadMore: (previousData, dataList) => {
      if (!previousData) return true // initial load
      return dataList.length * 10 < previousData.total
    },
    form: {
      initialValue: {
        name: '',
        gender: 'Boy',
        color: ['Red'],
      },
    },
    pagination: {
      page: 1,
      pageSize: 10,
    },
    immediateQueryKeys: ['color', 'gender'],
  })

  return (
    <Card>
      <KeyValue label="Test" value={123} />
      <div ref={ref} className="flex flex-col gap-2 h-480px p-2 w-full rounded bg-white/12 flex-nowrap overflow-scroll">
        {infiniteList.list.map((e) => {
          return e.data.map((item) => (
            <div key={item.id} className="bg-primary/80 rounded w-full py-1 px-2">
              {item.id} - {item.name}
            </div>
          ))
        })}

        {infiniteList.isLoading && (
          <div className="text-center my-1 py-1 dark:text-white animate-pulse">Loading...</div>
        )}
        {infiniteList.isLoadDone && <div className="text-center my-1 py-1 dark:text-white">No more data</div>}
      </div>
    </Card>
  )
}

async function fetchPagination(params: {
  page: number
  pageSize: number
}): Promise<{ data: Item[]; total: number }> {
  console.log('fetching data', params.page, params)

  await wait(600)

  const total = 57
  const isLastPage = params.page * params.pageSize >= total && (params.page - 1) * params.pageSize < total

  const startIdx = (params.page - 1) * params.pageSize
  const returnLength = isLastPage ? total - startIdx : params.pageSize

  return {
    data: Array.from({ length: returnLength }).map((_, i) => ({
      id: startIdx + i + 1,
      name: `name-${startIdx + i + 1}`,
    })),
    total,
  }
}
