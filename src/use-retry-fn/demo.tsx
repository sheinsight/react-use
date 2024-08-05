import { Button, Card, wait as mockFetch } from '@/components'
import { useRetryFn } from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

export function App() {
  const retryFn = useRetryFn(
    async () => {
      await mockFetch()
      return Promise.reject(new Error())
    },
    {
      retryCount: 3,
      onError(error, { currentCount }) {
        toast.error(`Retry... (count ${currentCount})`)
      },
      onRetryFailed(error) {
        toast.error('Retry failed')
      },
    },
  )

  return (
    <Card>
      <Button onClick={retryFn}>Fetch</Button>
      <Toaster />
    </Card>
  )
}
