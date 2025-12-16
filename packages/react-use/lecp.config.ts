import { defineConfig } from '@shined/lecp'

export default defineConfig({
  format: [
    { type: 'esm', outDir: 'dist' },
    { type: 'cjs', outDir: 'dist' },
  ],
  exclude: ['**/*.mdx', '**/demo.*'],
  targets: {
    node: '0.10.0', // 对应 ES5
    chrome: 19, // 对应 ES5
  },
  dts: true,
  clean: true,
  sourcemap: true,
})
