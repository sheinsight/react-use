import { configDefaults, defineProject } from 'vitest/config'

const fromDir = (path: string) => new URL(path, import.meta.url).pathname

export default defineProject({
  test: {
    environment: 'jsdom',
    environmentOptions: { jsdom: { pretendToBeVisual: true } },
    include: ['**/*.test.ts', '**/*.test.tsx', '**/*.ssr.test.ts', '**/*.ssr.test.tsx'],
    exclude: ['**/demo.tsx'],
    setupFiles: [fromDir('../../vitest.setup.ts')],
    alias: {
      '@/test': fromDir('../../testing/'),
      react: fromDir('../../node_modules/react/'),
    },
  },
})
