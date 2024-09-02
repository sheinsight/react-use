import { Button, Card, KeyValue, Zone } from '@/components'
import { useSpringValue } from '@shined/react-use'

const cls =
  'grid place-items-center rounded-2 absolute left-42px will-change-auto bg-primary/80 text-white w-48 h-20 transition ease-in'

export function App() {
  const spring = useSpringValue(0, 1, { damping: 1 })

  return (
    <Card>
      <KeyValue label="Spring Value" value={spring.value} />
      <Zone className="relative h-180px w-280px">
        <div className={cls} style={{ top: `${spring.value * 80 - 32}px` }}>
          ⚛️ React Hooks
        </div>
      </Zone>
      <div className="flex gap-2">
        <Button onClick={() => spring.pause(true)}>⏸️ pause</Button>
        <Button onClick={() => spring.resume(true)}>▶️ resume</Button>
        <Button onClick={spring.restart}>🔁 restart</Button>
      </div>
    </Card>
  )
}
