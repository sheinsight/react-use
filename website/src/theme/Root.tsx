import 'uno.css'

import { useFavicon, useMount } from '@site/../src'
import React from 'react'

export default function Root({ children }) {
  const [_, actions] = useFavicon()

  useMount(() => actions.setEmojiFavicon('🪝'))

  return <>{children}</>
}
