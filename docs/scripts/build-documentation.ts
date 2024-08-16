import 'zx/globals'

const isSoDoc = process.env.PIPLINENAME === 'SODOC'
const __dirname = new URL('.', import.meta.url).pathname

if (isSoDoc) {
  process.env.IS_SODOC = 'true'

  await $`pnpm add @alita/rspress-plugin@^1.5.0-beta.2 @shein/rspress-plugin-sodoc`
}

await $`rspress build`

if (isSoDoc) {
  await $({ cwd: __dirname })`cp -r ../docs-dist ../../docs-dist`
}
