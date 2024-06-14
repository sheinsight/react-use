import { Button, Card, KeyValue, Zone, wait as mockFetch } from '@/components'
import { createSingleLoading } from '@shined/use'

const pageLoading = createSingleLoading()

const fetchOutsideReact = pageLoading.bind(async (num: number) => {
  await mockFetch()
  console.log(`num is ${num}`)
})

export function App() {
  const loading = pageLoading.useLoading()

  const fn = pageLoading.useAsyncFn(() => mockFetch())
  const fn2 = pageLoading.useAsyncFn(() => mockFetch())
  const fn3 = pageLoading.useAsyncFn(() => mockFetch())

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
        <Button disabled={loading} onClick={fn.run}>Fetch</Button>
        {/* biome-ignore format: for demo */}
        <Button disabled={loading} onClick={fn2.run}>Fetch 2</Button>
        {/* biome-ignore format: for demo */}
        <Button disabled={loading} onClick={fn3.run}>Fetch 3</Button>
        {/* biome-ignore format: for demo */}
        <Button disabled={loading} onClick={fnWithError.run}>Fetch with Error</Button>
      </Zone>
      <Zone>
        {/* biome-ignore format: for demo */}
        <Button disabled={loading} onClick={() => fetchOutsideReact(1)}>Fetch outside React</Button>
        <Button onClick={() => fn.setLoading(!loading)}>Toggle by Hook</Button>
        <Button onClick={() => pageLoading.set(!loading)}>Toggle by instance</Button>
      </Zone>
    </Card>
  )
}
