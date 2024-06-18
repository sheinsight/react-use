import { Button, Card, KeyValue, LabelInput, Zone } from '@/components'
import { useControlledComponent, usePagination } from '@shined/react-use'

const TOTAL = 100

export function App() {
  const pageSizeInput = useControlledComponent('20')
  const targetPageInput = useControlledComponent('1')

  const pagination = usePagination({ pageSize: +pageSizeInput.value, total: TOTAL })

  return (
    <Card>
      <Zone>
        <KeyValue label="Total count" value={TOTAL} />
        <LabelInput label="Page size" {...pageSizeInput.props} />
      </Zone>
      <Zone>
        <KeyValue label="Current page" value={pagination.currentPage} />
        <KeyValue label="Page count" value={pagination.pageCount} />
      </Zone>
      <Zone>
        <Button onClick={pagination.prev} disabled={pagination.isFirstPage}>
          Prev
        </Button>
        {Array.from({ length: pagination.pageCount }, (_, i) => {
          const isCurrent = i + 1 === pagination.currentPage
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: for demo
            <Button key={i} onClick={() => pagination.go(i + 1)} disabled={isCurrent}>
              {i + 1}
            </Button>
          )
        })}
        <Button onClick={pagination.next} disabled={pagination.isLastPage}>
          Next
        </Button>
        <LabelInput className="min-w-60px! w-60px" label="Target Page" {...targetPageInput.props} />
        <Button onClick={() => pagination.go(+targetPageInput.value)}>Go</Button>
      </Zone>
    </Card>
  )
}
