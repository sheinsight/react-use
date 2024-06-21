/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    passWithNoTests: true,
    alias: {
      '@/test': new URL('./testing/', import.meta.url).pathname,
    },
  },
})
