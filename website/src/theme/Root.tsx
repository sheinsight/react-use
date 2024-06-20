import 'uno.css'

import { useFavicon, useMount } from '@site/../src'
import React from 'react'

export default function Root({ children }) {
  const favicon = useFavicon()

  useMount(() => favicon.setEmojiFavicon('🪝'))

  return <>{children}</>
}
