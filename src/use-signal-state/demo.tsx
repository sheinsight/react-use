import { Button, Card, Input, Toaster, toast } from '@/components'
import { useSafeState, useSignalState } from '@shined/react-use'

export function App() {
  const [name, setName] = useSignalState('')
  const [name2, setName2] = useSafeState('')

  return (
    <Card>
      <Input
        placeholder="Name"
        value={name()}
        onChange={(e) => {
          setName(e.target.value)
          setName2(e.target.value)
        }}
      />

      <Button
        onClick={() => {
          toast('Please continue to input within 3 seconds to see the difference')
          setTimeout(() => {
            toast(`signal: ${name()}, normal: ${name2}`)
          }, 3000)
        }}
      >
        Show name
      </Button>
      <Toaster />
    </Card>
  )
}
