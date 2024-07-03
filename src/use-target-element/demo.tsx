import { Card } from '@/components'
import { useIntervalFn, useTargetElement } from '@shined/react-use'
import { useId, useRef } from 'react'

export function App() {
  const ref = useRef<HTMLDivElement | null>(null)
  const el1 = useTargetElement(ref) // Recommended, specific element, SSR-friendly

  const id = useId() // Recommended, if you prefer to target element by id
  const el2 = useTargetElement(() => `#${CSS.escape(id)}-div`)

  const el3 = useTargetElement(() => window)
  const el4 = useTargetElement(() => document.documentElement)
  const el5 = useTargetElement(() => document.querySelector('section'))
  const el6 = useTargetElement('button.green-btn')
  const el7 = useTargetElement('#el-id')
  const el8 = useTargetElement('div.blue-bg')
  // const el9 = useTargetElement(document.body) // NOT recommended, it's not SSR-friendly

  useIntervalFn(() => {
    // biome-ignore format: no wrap
    console.log([el1.current, el2.current, el3.current, el4.current, el5.current, el6.current, el7.current, el8.current])
  }, 1000)

  return (
    <Card row>
      <button type="button" className="green-btn border-0 text-base rounded bg-primary/60 px-4 py-1">
        button.green-btn
      </button>
      {/* biome-ignore format: no wrap */}
      <div id="el-id" className="rounded bg-amber/80 px-4 py-1">#el-id</div>
      {/* biome-ignore format: no wrap */}
      <div ref={ref} className="rounded bg-cyan/80 px-4 py-1">ref</div>
      <div className="blue-bg rounded bg-blue/80 px-4 py-1">div.class</div>
      {/* biome-ignore format: no wrap */}
      <div id={`${id}-div`} className="blue-bg rounded bg-purple/80 px-4 py-1">{'id={`${id}-div`}'}</div>
      <section className="rounded bg-red/80 px-4 py-1">section</section>
    </Card>
  )
}
