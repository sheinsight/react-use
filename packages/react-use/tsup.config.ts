import { defineConfig } from 'tsup'

export default defineConfig({
  target: 'es5',
  entry: ['./src/index.ts'],
  tsconfig: './tsconfig.build.json',
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: true,
  outDir: 'dist',
  format: ['esm', 'cjs'],
})
