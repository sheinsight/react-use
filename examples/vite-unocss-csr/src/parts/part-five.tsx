import { useRef } from 'react'

import {
  useAdaptiveTextarea,
  useCloned,
  useMemoize,
  useMount,
  useRender,
  useSafeState,
  useScrollLock,
  useStateHistory,
} from '@shined/react-use'

const addTen = (a: number) => {
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      console.log('calculating add 10!')
      resolve(a + 10)
    })
  })
}

export const PartFive = () => {
  const [state, setState] = useSafeState({ hash: 'Viki' })

  const render = useRender()

  const divRef = useRef<HTMLDivElement>(null)
  const [cloned] = useCloned(state)

  // const { memory } = useBrowserMemory()
  const { pause, resume, isActive, history, commit, canRedo, canUndo, redo, undo } = useStateHistory(state, {
    // debounce: 300,
  })

  const [isLocked, _, { toggle }] = useScrollLock(divRef)
  const textarea = useAdaptiveTextarea()

  const add = useMemoize(addTen)

  useMount(() => {
    const promises = [add(1), add(1), add(2), add(1), add(3), add(1), add(2), add(3)]

    for (const promise of promises) {
      promise.then(console.log)
    }
  })

  console.log('PartFive render at', Date.now())

  return (
    <div>
      <pre>{textarea.height}</pre>
      <textarea rows={1} className="resize-none" ref={textarea.ref} />
      <button type="button" onClick={toggle}>
        {isLocked ? 'unlock' : 'lock'}
      </button>
      <div ref={divRef} className="h-40 p-4 w-40 bg-green overflow-scroll">
        <div className="h-60 w-60 bg-orange">isLocked: {isLocked ? 'true' : 'false'}</div>
      </div>
      <div>
        <button type="button" onClick={commit}>
          commit
        </button>
        <button type="button" onClick={redo} disabled={!canRedo}>
          redo
        </button>
        <button type="button" onClick={undo} disabled={!canUndo}>
          undo
        </button>
        <button
          type="button"
          onClick={() => {
            pause()
            render()
          }}
          disabled={!isActive()}
        >
          pause
        </button>
        <button
          type="button"
          onClick={() => {
            resume(false)
            render()
          }}
          disabled={isActive()}
        >
          resume
        </button>
        {history.map((item, index) => (
          <pre key={item.timestamp}>
            timestamp: {item.timestamp}, snapshot: {JSON.stringify(item.snapshot)}
          </pre>
        ))}
      </div>
      <pre>state: {JSON.stringify(state, null, 2)}</pre>
      <pre>cloned: {JSON.stringify(cloned, null, 2)}</pre>
      {/* <pre>memory: {JSON.stringify(memory, null, 2)}</pre> */}
    </div>
  )
}
