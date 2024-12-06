import 'zx/globals'

const isSoDoc = process.env.PIPLINENAME === 'SODOC'

$.verbose = true

if (isSoDoc) {
  process.env.IS_SODOC = 'true'

  await $`pnpm add @alita/rspress-plugin@^1.6.3 @shein/rspress-plugin-sodoc`
}

await $`rspress build`

if (isSoDoc) {
  await $`cp -r ./docs-dist ../docs-dist`
}
