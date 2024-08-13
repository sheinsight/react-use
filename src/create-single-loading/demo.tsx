import { Button, Card, KeyValue, OTP, Zone, wait as mockFetch } from '@/components'
import { createSingleLoading } from '@shined/react-use'
import { create } from '@shined/reactive'

const pageLoading = createSingleLoading({ create })

const fetchOutsideReact = pageLoading.bind(async (otp: string) => {
  await mockFetch()
  console.log(`one time password is ${otp}`)
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
      <KeyValue label="Loading">{loading}</KeyValue>
      <Zone>
        <Button disabled={loading} onClick={fetchUser.run}>
          fetchUser
        </Button>
        <Button disabled={loading} onClick={fetchPost.run}>
          fetchPost
        </Button>
        <Button disabled={loading} onClick={fetchComment.run}>
          fetchComment
        </Button>
        <Button disabled={loading} onClick={fnWithError.run}>
          Fetch with Error
        </Button>
      </Zone>
      <Zone>
        <Button disabled={loading} onClick={() => fetchOutsideReact(OTP())}>
          Fetch outside React
        </Button>
        <Button onClick={() => fetchUser.setLoading(!loading)}>Toggle via Hook</Button>
        <Button onClick={() => pageLoading.set(!loading)}>Toggle via instance</Button>
      </Zone>
    </Card>
  )
}
