'use client'

import { useCircularList, useElementSize, useTitle } from '@shined/use'

export function Client() {
  const { width, height } = useElementSize('#el-textarea')
  const content = JSON.stringify({ width, height }, null, 2)

  useTitle('Client')

  const [state, action, idx] = useCircularList(Array.from({ length: 3 }, (_, i) => i + 1))

  return (
    <>
      <textarea disabled id="el-textarea" value={content} onChange={() => {}} />

      <div>
        state: {state}, index: {idx}
      </div>
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
