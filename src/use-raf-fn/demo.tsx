import { Button, Card } from '@/components'
import { useRafFn } from '@shined/react-use'

export function App() {
  const logInRaf = useRafFn(() => {
    console.log('logged at', performance.now())
  })

  function handlerClick() {
    console.log('start to log at next frame at', performance.now())

    // log here, but will be executed at next frame after the heavy work
    logInRaf()

    // mock to do some heavy work in same execution context
    for (let i = 0; i < 1000000000; i++) {}
  }

  return (
    <Card>
      <Button onClick={handlerClick}>Log in RAF & do heavy work</Button>
    </Card>
  )
}
