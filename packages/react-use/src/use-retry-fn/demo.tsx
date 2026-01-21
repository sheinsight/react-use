import { Button, Section, Toaster, wait as mockFetch, toast } from '@/components'
import { useRetryFn } from '@shined/react-use'

export function App() {
  const retryFn = useRetryFn(
    async () => {
      await mockFetch()
      return Promise.reject(new Error())
    },
    {
      interval: 1000,
      onErrorRetry(error, retryState) {
        toast.error(`Retry... (count ${retryState.currentCount})`)
      },
      onRetryFailed(_error) {
        toast.error('Retry failed')
      },
    },
  )

  return (
    <Section>
      <Button onClick={retryFn}>Fetch</Button>
      <Toaster />
    </Section>
  )
}
