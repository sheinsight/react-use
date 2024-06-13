import { Card, KeyValue } from '@/components'
import { useAdaptiveTextarea, useCounter, useLoremIpsum } from '@shined/use'

export function App() {
  const lorem = useLoremIpsum()
  const [resizeTimes, actions] = useCounter(0)

  const ta = useAdaptiveTextarea({
    // styleProp: 'minHeight',
    onResize: (_height) => actions.inc(),
  })

  return (
    <Card>
      <div className="flex gap-4">
        <KeyValue label="Textarea height" value={ta.height} />
        <KeyValue label="Resize times" value={resizeTimes} />
      </div>

      <textarea
        ref={ta.ref} // add ref to textarea to measure height
        style={{ resize: 'none' }} // disable resize to use adaptive height
        defaultValue={lorem}
        className="font-sans! px-4 py-2 w-72vw md:w-480px text-16px leading-24px input-border text-pretty"
      />
    </Card>
  )
}
