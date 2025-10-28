import { Button, Card, KeyValue, Toaster, Zone, toast } from '@/components'
import { useActivityMount, useCounter, useMount, useToggle, useUnmount } from '@shined/react-use'
import { Activity } from 'react'

export function App() {
  const [visible, { toggle }] = useToggle(true)

  useUnmount(() => toast.remove())

  return (
    <Card>
      <Button onClick={toggle}>Toggle Activity {visible ? 'Hidden' : 'Visible'}</Button>
      <Activity mode={visible ? 'visible' : 'hidden'}>
        <ComparisonDemo />
      </Activity>
      <Toaster />
    </Card>
  )
}

function ComparisonDemo() {
  const [activityMountCount, { inc: incActivityMount }] = useCounter(0)
  const [regularMountCount, { inc: incRegularMount }] = useCounter(0)

  // useActivityMount: Only executes once when the component first mounts
  useActivityMount(() => {
    incActivityMount()
    toast.success('useActivityMount called')
  })

  // useMount: Executes every time the Activity becomes visible
  useMount(() => {
    incRegularMount()
    toast.success('useMount called')
  })

  return (
    <Zone border="primary">
      <h3>Comparison: useActivityMount vs useMount</h3>
      <KeyValue label="useActivityMount count" value={activityMountCount} />
      <KeyValue label="useMount count" value={regularMountCount} />
      <p>
        <strong>Toggle the Activity to see the difference:</strong>
      </p>
      <ul>
        <li>
          <code>useActivityMount</code> only executes <strong>once</strong> (initial mount)
        </li>
        <li>
          <code>useMount</code> executes <strong>every time</strong> Activity becomes visible
        </li>
      </ul>
    </Zone>
  )
}
