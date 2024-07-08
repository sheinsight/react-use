import 'uno.css'

import { useFavicon, useMount } from '@site/../src'

import type React from 'react'

export default function Root({ children }: { children: React.ReactNode }) {
  const favicon = useFavicon()

  useMount(() => favicon.setEmojiFavicon('🪝'))

  return <>{children}</>
}
