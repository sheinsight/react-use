import { Button, Card, cn } from '@/components'
import { useLayoutMount, useMount, useToggle } from '@shined/react-use'

export function App() {
  return (
    <Card>
      <Button onClick={() => window.location.reload()}>Refresh page</Button>
      <LayoutMount />
      <Mount />
    </Card>
  )
}

function Mount() {
  const [status, toggle] = useToggle(true)
  const cls = status ? 'bg-red/80 w-60 h-20' : 'bg-gray/80 w-54 h-12'
  useMount(toggle)
  return <div className={cn('p-4 h-12 text-white rounded flex items-center', cls)}>useMount (layout jitter)</div>
}

function LayoutMount() {
  const [status, toggle] = useToggle(true)
  const cls = status ? 'bg-red/80 w-60 h-20' : 'bg-gray/80 w-54 h-12'
  useLayoutMount(toggle)
  return <div className={cn('p-4 text-white rounded flex items-center', cls)}>useLayoutMount</div>
}
