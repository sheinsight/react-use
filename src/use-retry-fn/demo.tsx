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
      retryInterval: 1000,
      onError(error, retryState) {
        toast.error(`Retry... (count ${retryState.currentCount})`)
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
