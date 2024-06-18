import { Button, Card, Zone } from '@/components'
import { useIntervalFn, useRafLoop, useSafeState } from '@shined/use'

const FPS = 60
const config = { immediate: false }
const railCls = 'relative h-80px w-300px rounded bg-amber/20 flex items-center p-2'
const boxCls = 'absolute size-64px rounded grid place-content-center will-change-auto'

export function App() {
  const [rafLeft, setRafLeft] = useSafeState(8)
  const [iLeft, setILeft] = useSafeState(8)

  const rafHandler = () => (rafLeft >= 228 ? rafC.pause(true) : setRafLeft(rafLeft + 1))
  const rafC = useRafLoop(rafHandler, config)

  const intervalHandler = () => (iLeft >= 228 ? intervalC.pause(true) : setILeft(iLeft + 1))
  const intervalC = useIntervalFn(intervalHandler, 1000 / FPS, config)

  // biome-ignore lint/style/noCommaOperator: no wrap for demo
  const start = () => void (rafC.resume(true), intervalC.resume(true))
  // biome-ignore lint/style/noCommaOperator: no wrap for demo
  const stop = () => void (rafC.pause(true), intervalC.pause(true))
  // biome-ignore lint/style/noCommaOperator: no wrap for demo
  const reset = () => void (stop(), setRafLeft(8), setILeft(8))
  // biome-ignore lint/style/noCommaOperator: no wrap for demo
  const restart = () => void (reset(), rafC.resume(true), intervalC.resume(true))

  return (
    <Card>
      <div className={railCls}>
        {/* biome-ignore format: for demo */}
        <div className={`${boxCls} bg-blue`} style={{ left: rafLeft }}>RAF</div>
      </div>
      <div className={railCls}>
        {/* biome-ignore format: for demo */}
        <div className={`${boxCls} bg-red`} style={{ left: iLeft }}>Interval</div>
      </div>
      <Zone>
        <Button onClick={start}>Start</Button>
        <Button onClick={stop}>Stop</Button>
        <Button onClick={reset}>Reset</Button>
        <Button onClick={restart}>Restart</Button>
      </Zone>
    </Card>
  )
}
