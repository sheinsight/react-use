import { Card, KeyValue } from '@/components'
import { useClickOutside, useCounter } from '@shined/react-use'
import { useRef } from 'react'

const cls =
  'px-4 size-[72px] rounded-2 text-white flex items-center justify-center cursor-pointer select-none hover:opacity-96 active:opacity-80 transition'

export function App() {
  const [count, actions] = useCounter(0)

  const ref = useRef<HTMLDivElement | null>(null)
  useClickOutside(ref, () => actions.inc(), { ignore: ['#ignored-div'] })

  return (
    <Card>
      <KeyValue label="Outside of target click times" value={count} />

      <div className="flex gap-4">
        <div ref={ref} className={`${cls} bg-orange/80`}>
          Target
        </div>
        <div className={`${cls} bg-blue/80`}>Other</div>
        <div className={`${cls} bg-blue/80`}>Other</div>
      </div>

      <div className="flex gap-4">
        <div className={`${cls} bg-blue/80`}>Other</div>
        <div id="ignored-div" className={`${cls} bg-gray/80`}>
          Ignored
        </div>
        <div className={`${cls} bg-blue/80`}>Other</div>
      </div>
    </Card>
  )
}
