import { Button, Card, Input, KeyValue, Zone, cn, wait } from '@/components'
import { usePagingList, useUpdateEffect } from '@shined/react-use'

const genders = ['Boy', 'Girl'] as const
const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Violet'] as const

interface FormState {
  name: string
  gender: (typeof genders)[number]
  color: (typeof colors)[number][]
}

interface Item {
  id: number
  name: string
}

export function App() {
  const { list, loading, form, refresh, pagination, selection } = usePagingList<Item, FormState>({
    fetcher: async (params) => {
      const { page, pageSize, form: _form, setTotal } = params
      const { data, total } = await fetchPagination({ page, pageSize })
      setTotal(total)
      return data
    },
    form: {
      initialValue: {
        name: '',
        gender: 'Boy',
        color: ['Red'],
      },
    },
    query: {
      refreshInterval: 6_000,
    },
    pagination: {
      page: 1,
      pageSize: 5,
    },
    immediateQueryKeys: ['color', 'gender'],
    pageStrategy: 'preserve',
  })

  // when you use third-party components, you can use `selection.isPartiallySelected` directly
  useUpdateEffect(() => {
    const selectAllInput = document.querySelector('input[name="select-all"]') as HTMLInputElement
    selectAllInput.indeterminate = selection.isPartiallySelected
  }, [selection.isPartiallySelected])

  return (
    <Card>
      <form {...form.nativeProps}>
        <Zone border="amber">
          <Zone>
            <span className="text-right inline-block w-80px">Name:</span>
            <Input name="name" placeholder="Name" />
            <Button type="submit">Search</Button>
            <Button type="reset">Reset</Button>
            <Button onClick={() => refresh()}>Refresh</Button>
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
            const [item1, _, item3] = list
            if (item1) {
              selection.select(item1)
            }
            if (item3) {
              selection.select(item3)
            }
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
      </Zone>
      <Zone row={false} border="primary" className={cn('min-h-180px justify-start!', loading ? 'opacity-60' : '')}>
        {list.map((item, idx) => (
          <div
            key={item.id}
            className={cn(
              'px-2 py-1 rounded cursor-pointer',
              selection.isItemSelected(item) ? 'bg-primary/60' : 'hover:bg-primary/20',
            )}
            onClick={() => selection.toggle(item)}
          >
            <input
              type="checkbox"
              className="mr-2"
              checked={selection.isItemSelected(item)}
              onChange={() => {
                selection.toggle(item)
              }}
            />
            Index: {idx}, Data: {JSON.stringify(item)}
          </div>
        ))}
        {list.length === 0 && <div className="text-center">No data</div>}
      </Zone>
      <Zone border="red">
        {selection.selected.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
        {selection.selected.length === 0 && <div className="text-center">No selected</div>}
      </Zone>
      <Zone>
        <KeyValue label="Total" value={pagination.total} />
        <KeyValue label="Current" value={`${pagination.countStart} - ${pagination.countEnd}`} />
      </Zone>
      <Zone>
        {Array.from({ length: pagination.pageCount }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: for demo
          <Button disabled={loading || pagination.page === i + 1} key={i} onClick={() => pagination.go(i + 1)}>
            {i + 1}
          </Button>
        ))}
      </Zone>
      <Zone>
        <span>Page Size:</span>
        {[5, 10, 20].map((pageSize) => (
          <Button
            key={pageSize}
            disabled={loading || pagination.pageSize === pageSize}
            onClick={() => pagination.setPageSize(pageSize)}
          >
            {pageSize}
          </Button>
        ))}
      </Zone>
    </Card>
  )
}

async function fetchPagination(params: { page: number; pageSize: number }): Promise<{ data: Item[]; total: number }> {
  await wait()

  const total = 217
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
