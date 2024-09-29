/// <reference types="vitest" />

import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      environment: 'jsdom',
      environmentOptions: { jsdom: { pretendToBeVisual: true } },
      include: ['./packages/react-use/**/*.{,ssr.}test.{ts,tsx}'],
      setupFiles: ['./vitest.setup.ts'],
      alias: {
        '@/test': new URL('./testing/', import.meta.url).pathname,
        react: new URL('./node_modules/react/', import.meta.url).pathname,
      },
    },
  },
])
