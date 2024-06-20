import { Button, Card, KeyValue, Zone, wait as mockFetch } from '@/components'
import { createSingleLoading } from '@shined/react-use'

const pageLoading = createSingleLoading()

const fetchOutsideReact = pageLoading.bind(async (num: number) => {
  await mockFetch()
  console.log(`num is ${num}`)
})

export function App() {
  const loading = pageLoading.useLoading()

  const fetchUser = pageLoading.useAsyncFn(() => mockFetch())
  const fetchPost = pageLoading.useAsyncFn(() => mockFetch())
  const fetchComment = pageLoading.useAsyncFn(() => mockFetch())

  const fnWithError = pageLoading.useAsyncFn(async () => {
    await mockFetch()
    throw new Error('mock fetch error')
  })

  return (
    <Card>
      <Zone>
        <KeyValue label="Loading">{loading}</KeyValue>
      </Zone>
      <Zone>
        {/* biome-ignore format: for demo */}
        <Button disabled={loading} onClick={fetchUser.run}>fetchUser</Button>
        {/* biome-ignore format: for demo */}
        <Button disabled={loading} onClick={fetchPost.run}>fetchPost</Button>
        {/* biome-ignore format: for demo */}
        <Button disabled={loading} onClick={fetchComment.run}>fetchComment</Button>
        {/* biome-ignore format: for demo */}
        <Button disabled={loading} onClick={fnWithError.run}>Fetch with Error</Button>
      </Zone>
      <Zone>
        {/* biome-ignore format: for demo */}
        <Button disabled={loading} onClick={() => fetchOutsideReact(1)}>Fetch outside React</Button>
        <Button onClick={() => fetchUser.setLoading(!loading)}>Toggle via Hook</Button>
        <Button onClick={() => pageLoading.set(!loading)}>Toggle via instance</Button>
      </Zone>
    </Card>
  )
}
