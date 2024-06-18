import { Card } from '@/components'
import { useIntervalFn, useTargetElement } from '@shined/react-use'

export function App() {
  const el1 = useTargetElement('button.el')
  const el2 = useTargetElement('#id')
  const el3 = useTargetElement('div.class')
  // const el4 = useTargetElement(document.body) // not SSR-friendly
  const el5 = useTargetElement(() => window)
  const el7 = useTargetElement(() => document.documentElement)
  const el6 = useTargetElement(() => document.querySelector('section'))

  useIntervalFn(() => {
    console.log(el1.current, el2.current, el3.current, el5.current, el6.current, el7.current)
  }, 1000)

  return (
    <Card row>
      <button type="button" className="el border-0 text-base rounded bg-primary/80 px-4 py-1">
        button.el
      </button>
      {/* biome-ignore format: for demo */}
      <div className="rounded bg-amber/80 px-4 py-1" id="id">#id</div>
      <div className="class rounded bg-blue/80 px-4 py-1">div.class</div>
      <section className="rounded bg-red/80 px-4 py-1">section</section>
    </Card>
  )
}
