import { Button, Card, KeyValue } from '@/components'
import { useSafeState, useScriptTag } from '@shined/use'

declare global {
  interface Window {
    confetti: (options: { particleCount: number; origin: { y: number } }) => void
  }
}

const src = 'https://unpkg.com/canvas-confetti@1.9.3/dist/confetti.browser.js'

export function App() {
  const [loaded, setLoaded] = useSafeState(false)

  useScriptTag(src, () => setLoaded(true))

  function handleConfettiClick() {
    if (window.confetti) {
      window.confetti({ particleCount: 100, origin: { y: 0.6 } })
    }
  }

  return (
    <Card>
      <KeyValue label="Script Loaded" value={loaded} />
      <Button onClick={handleConfettiClick}>Click me</Button>
    </Card>
  )
}
