import { Button, Card, KeyValue, LabelInput, Zone } from '@/components'
import { useControlledComponent, usePagination } from '@shined/react-use'

const TOTAL = 100

export function App() {
  const pageSizeInput = useControlledComponent('20')
  const targetPageInput = useControlledComponent('1')

  const [state, actions] = usePagination({ pageSize: +pageSizeInput.value, total: TOTAL })

  return (
    <Card>
      <Zone>
        <KeyValue label="Total count" value={TOTAL} />
        <LabelInput label="Page size" {...pageSizeInput.props} />
      </Zone>
      <Zone>
        <KeyValue label="Current page" value={state.currentPage} />
        <KeyValue label="Page count" value={state.pageCount} />
      </Zone>
      <Zone>
        <Button onClick={actions.prev} disabled={state.isFirstPage}>
          Prev
        </Button>
        {Array.from({ length: state.pageCount }, (_, i) => {
          const isCurrent = i + 1 === state.currentPage
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: for demo
            <Button key={i} onClick={() => actions.go(i + 1)} disabled={isCurrent}>
              {i + 1}
            </Button>
          )
        })}
        <Button onClick={actions.next} disabled={state.isLastPage}>
          Next
        </Button>
        <LabelInput className="min-w-60px! w-60px" label="Target Page" {...targetPageInput.props} />
        <Button onClick={() => actions.go(+targetPageInput.value)}>Go</Button>
      </Zone>
    </Card>
  )
}
