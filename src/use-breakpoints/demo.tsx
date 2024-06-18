import { Card, KeyValue } from '@/components'
import { useBreakpoints, useEventListener, useMount, useSafeState } from '@shined/react-use'

const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 }

export function App() {
  const [state, setState] = useSafeState({
    isGreaterOrEqualLg: false,
    isInBetweenMdXl: false,
  })

  const { md, isGreaterOrEqual, isInBetween, currents } = useBreakpoints(breakpoints)

  function updateState() {
    setState({
      isGreaterOrEqualLg: isGreaterOrEqual('lg'),
      isInBetweenMdXl: isInBetween('md', 'xl'),
    })
  }

  useMount(updateState)

  useEventListener(() => window, 'resize', updateState)

  return (
    <Card>
      <KeyValue label="Match 'md'" value={md} />
      <KeyValue label="IsGreaterOrEqual('lg')" value={state.isGreaterOrEqualLg} />
      <KeyValue label="IsInBetween('md', 'xl') " value={state.isInBetweenMdXl} />
      <KeyValue label="Max matched" value={currents[currents.length - 1]} />
      <KeyValue label="Currents matched" value={`[${currents.join(', ')}]`} />
    </Card>
  )
}
