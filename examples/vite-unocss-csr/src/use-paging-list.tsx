import { usePagingList } from '@shined/react-use'

export function UsePagingList() {
  const { list, pagination } = usePagingList({
    async fetcher({ setTotal }) {
      const data = Array.from({ length: 87 }).map((_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
      setTotal(data.length)
      return data
    },
    pagination: {
      page: 3,
    },
  })

  return (
    <div>
      <div>Page: {pagination.page}</div>
      <div>Page Count: {pagination.pageCount}</div>
      <div>Page Size: {pagination.pageSize}</div>
      <button onClick={() => pagination.prev()}>Prev Page</button>
      <button onClick={() => pagination.next()}>Next Page</button>
      <pre>{JSON.stringify(list, null, 2)}</pre>
    </div>
  )
}
