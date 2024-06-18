'use client'

import { useBrowserMemory, useCircularList, useElementSize, useTitle } from '@shined/react-use'

export function Client() {
  const { width, height } = useElementSize('#el-textarea')
  const content = JSON.stringify({ width, height }, null, 2)

  useTitle('Client')

  const { jsHeapSizeLimit, usedJSHeapSize, totalJSHeapSize } = useBrowserMemory()
  const [state, action, idx] = useCircularList(Array.from({ length: 3 }, (_, i) => i + 1))

  return (
    <>
      <textarea disabled id="el-textarea" value={content} onChange={() => {}} />

      <div>
        state: {state}, index: {idx}
      </div>

      <pre>{JSON.stringify({ jsHeapSizeLimit, usedJSHeapSize, totalJSHeapSize }, null, 2)}</pre>

      <button
        type="button"
        onClick={() => {
          action.next()
        }}
      >
        Next
      </button>
    </>
  )
}
