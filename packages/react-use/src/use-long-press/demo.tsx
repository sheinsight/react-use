import { KeyValue, Section } from '@/components'
import { useCounter, useLongPress } from '@shined/react-use'

import type { UseLongPressReturns } from '@shined/react-use'

const getTipAndBgColor = (lp: UseLongPressReturns) => {
  if (lp.isMeetThreshold) return { tip: 'Meet threshold 😅', bgColor: 'bg-red/80' }
  if (lp.isLongPressed) return { tip: 'Long pressed 👍', bgColor: 'bg-primary/80' }
  if (lp.isPressed) return { tip: 'Pressed, hold on 😊', bgColor: 'bg-blue/80' }
  return { tip: 'Long press here 😭', bgColor: 'bg-amber/80' }
}

export function App() {
  const [count, actions] = useCounter(0)
  const lp = useLongPress('#el-long-press', () => actions.inc())

  const { bgColor, tip } = getTipAndBgColor(lp)

  return (
    <Section>
      <KeyValue label="Long press times" value={count} />
      <div id="el-long-press" className={`${bgColor} w-48 h-24 rounded grid place-content-center select-none`}>
        {tip}
      </div>
    </Section>
  )
}
