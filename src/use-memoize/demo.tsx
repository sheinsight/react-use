import { Button, Card, Zone, wait as mockFetch } from '@/components'
import { useMemoize, useUnmount } from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

async function getUserById(id: number) {
  toast.success(`Fetching user ${id}...`, { icon: '👤' })
  await mockFetch(300)
  return `John Doe ${id} at ${new Date().toLocaleTimeString()}`
}

export function App() {
  const cachedGetUserById = useMemoize(getUserById)

  async function show(id: number) {
    const result = await cachedGetUserById(id)
    toast.success(`fn(${id}) => "${result}"`)
  }

  async function showWithoutCache(id: number) {
    const result = await cachedGetUserById.load(id)
    toast.success(`fn.load(${id}) => "${result}"`)
  }

  useUnmount(() => toast.remove())

  return (
    <Card>
      <Zone>
        <Button onClick={() => show(1)}>Fetch user 1</Button>
        <Button onClick={() => show(2)}>Fetch user 2</Button>
        <Button onClick={() => show(3)}>Fetch user 3</Button>
      </Zone>
      <Zone>
        <Button onClick={() => cachedGetUserById.delete(1)}>Clear user 1 cache</Button>
        <Button onClick={() => cachedGetUserById.clear()}>Clear all cache</Button>
        <Button onClick={() => showWithoutCache(1)}>Reload user 1 (no cache)</Button>
      </Zone>
      <Toaster />
    </Card>
  )
}
