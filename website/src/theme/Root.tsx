import 'uno.css'

import React from 'react'
import { useFavicon, useMount } from '@site/../src'

export default function Root({ children }) {
  const [_, actions] = useFavicon()

  useMount(() => actions.setEmojiFavicon('🪝'))

  return <>{children}</>
}
