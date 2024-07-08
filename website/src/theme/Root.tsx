import '@unocss/reset/normalize.css'
import 'uno.css'

import type React from 'react'

export default function Root({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
