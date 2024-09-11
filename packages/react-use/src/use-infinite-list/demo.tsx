import { Button, Card, Input, KeyValue, Zone, cn, wait } from '@/components'
import { generateLoremIpsum, useInfiniteList, useUpdateEffect } from '@shined/react-use'
import { useRef } from 'react'

interface Data {
  data: { id: number; name: string }[]
  total: number
}

const genders = ['Boy', 'Girl'] as const
const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Violet'] as const

export function App() {
  const ref = useRef<HTMLDivElement>(null)

  const { form, list, fullList, paginationState, selection, loading, isLoadDone } = useInfiniteList<
    Data,
    Data['data'][number],
    { name: string; gender: string; color: string[] }
  >({
    target: ref,
    fetcher: fetchPagination,
    mapFullList: (d) => d.data,
    canLoadMore: (previousData, dataList, fullList) => {
      if (!previousData) return true // initial load
      return fullList.length < previousData.total
    },
    form: {
      initialValue: {
        name: '',
        gender: 'Boy',
        color: ['Red'],
      },
    },
    pagination: { pageSize: 10 },
    immediateQueryKeys: ['color', 'gender'],
  })

  // when you use third-party components, you can use `selection.isPartiallySelected` directly
  useUpdateEffect(() => {
    const selectAllInput = document.querySelector('input[name="select-all"]') as HTMLInputElement
    selectAllInput.indeterminate = selection.isPartiallySelected
  }, [selection.isPartiallySelected])

  return (
    <Card>
      <h1 className="text-xl font-medium mt-4">1. Scroll to Load More</h1>
      <form {...form.nativeProps}>
        <Zone border="amber">
          <Zone>
            <span className="text-right inline-block w-80px">Name:</span>
            <Input name="name" placeholder="Name" />
            <Button disabled={loading} type="submit">
              Search
            </Button>
            <Button disabled={loading} type="reset">
              Reset
            </Button>
          </Zone>
          <Zone>
            <span className="text-right inline-block w-80px">Gender:</span>
            {genders.map((gender) => (
              <label key={gender}>
                <input name="gender" type="radio" required value={gender} />
                <span className="ml-1">{gender}</span>
              </label>
            ))}
          </Zone>
          <Zone>
            <span className="text-right inline-block w-80px">Color:</span>
            {colors.map((color) => (
              <label key={color}>
                <input name="color" type="checkbox" value={color} />
                <span className="ml-1">{color}</span>
              </label>
            ))}
          </Zone>
        </Zone>
      </form>
      <Zone border="primary">
        <KeyValue label="Current Page" value={paginationState.page - 1} />
        <KeyValue label="Next Request Page" value={paginationState.page} />
        <KeyValue label="PageSize" value={paginationState.pageSize} />
        <KeyValue label="Data Count" value={list.flatMap((e) => e.data).length} />
      </Zone>
      <Zone border="blue">
        <label>
          <input
            name="select-all"
            type="checkbox"
            checked={selection.isAllSelected}
            onChange={(e) => {
              selection[e.target.checked ? 'selectAll' : 'unselectAll']()
            }}
          />
          <span className="ml-1">Select All</span>
        </label>
        <Button
          disabled={loading}
          onClick={() => {
            selection.unselectAll()
            const [item1, _, item3] = fullList
            item1 && selection.select(item1)
            item3 && selection.select(item3)
          }}
        >
          Select 1, 3
        </Button>
        <Button disabled={loading} onClick={() => selection.selectAll()}>
          Select All
        </Button>
        <Button disabled={loading} onClick={() => selection.unselectAll()}>
          Unselect All
        </Button>
        <KeyValue label="Loading" value={loading} />
        <KeyValue label="Load Done" value={isLoadDone} />
      </Zone>
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-2 h-300px p-2 w-full rounded bg-white/12 flex-nowrap overflow-scroll transition-all',
          loading ? 'opacity-60' : '',
        )}
      >
        {fullList.map((item) => {
          return (
            <div
              key={item.id}
              className={cn(
                'px-2 py-1 rounded cursor-pointer',
                selection.isItemSelected(item) ? 'bg-primary/60' : 'hover:bg-primary/20',
              )}
              onClick={() => selection.toggle(item)}
            >
              <input
                className="mr-2"
                type="checkbox"
                onChange={() => {
                  selection.toggle(item)
                }}
                checked={selection.isItemSelected(item)}
              />
              {item.id} - {item.name}
            </div>
          )
        })}

        {loading && <div className="text-center my-1 py-1 dark:text-white animate-pulse">Loading...</div>}
        {isLoadDone && <div className="text-center my-1 py-1 dark:text-white/60">No more data</div>}
      </div>

      <Zone border="red">
        {selection.selected.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
        {selection.selected.length === 0 && <div className="text-center">No selected</div>}
      </Zone>

      <hr />

      <h1 className="text-xl font-medium mt-4">2. Click to Load More</h1>
      <LoadMoreList />
    </Card>
  )
}

function LoadMoreList() {
  const { loadMore, fullList, loading, isLoadDone } = useInfiniteList<Data, Data['data'][number]>({
    fetcher: fetchPagination,
    mapFullList: (d) => d.data,
    canLoadMore: (previousData, dataList, fullList) => {
      if (!previousData) return true // initial load
      return fullList.length < previousData.total
    },
  })

  return (
    <div
      className={cn(
        'flex flex-col gap-2 h-300px p-2 w-full rounded bg-white/12 flex-nowrap overflow-scroll transition-all',
      )}
    >
      {fullList.map((item) => {
        return (
          <div key={item.id} className={cn('px-2 py-1 rounded hover:bg-primary/20')}>
            {item.id} - {item.name}
          </div>
        )
      })}

      {isLoadDone ? (
        <div className="text-center my-1 py-1 dark:text-white/60">No more data</div>
      ) : (
        <Button
          className={cn('text-center my-1 py-1 dark:text-white', loading ? 'animate-pulse' : '')}
          onClick={() => loadMore()}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  )
}

async function fetchPagination(params: { page: number; pageSize: number }): Promise<Data> {
  await wait(600)

  const total = 57
  const isLastPage = params.page * params.pageSize >= total && (params.page - 1) * params.pageSize < total

  const startIdx = (params.page - 1) * params.pageSize
  const returnLength = isLastPage ? total - startIdx : params.pageSize

  return {
    data: Array.from({ length: returnLength }).map((_, i) => ({
      id: startIdx + i + 1,
      name: generateLoremIpsum(),
    })),
    total,
  }
}
