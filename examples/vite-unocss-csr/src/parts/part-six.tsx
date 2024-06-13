import {
  useKeyDown,
  useKeyModifier,
  useKeyPress,
  useKeyStroke,
  useKeyUp,
  useLongPress,
  useUrlSearchParams,
} from '@shined/use'
import { useRef } from 'react'

export const PartSix = () => {
  const [url, setUrl] = useUrlSearchParams('hash-params')

  const altState = useKeyModifier('Alt')
  const ref = useRef<HTMLDivElement | null>(null)

  const { stop, ...res } = useLongPress(ref, () => {
    console.log('long press')
  })

  useKeyStroke('a', (e) => console.log('key stroke', e))
  useKeyPress('b', (e) => console.log('key pressed', e))
  useKeyDown('c', (e) => console.log('key down', e))
  useKeyUp('d', (e) => console.log('key up', e))

  return (
    <div className="p-4 bg-yellow">
      <div>{altState?.toString() ?? 'null'}</div>
      <pre>{JSON.stringify(res, null, 2)}</pre>
      <div className="w-60 h-20 bg-purple" ref={ref}>
        press here
      </div>
      <button type="button" onClick={() => setUrl({ a: '1' })}>
        setUrl
      </button>
    </div>
  )
}
