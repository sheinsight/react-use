import 'zx/globals'

const isSoDoc = process.env.PIPLINENAME === 'SODOC'

if (isSoDoc) {
  process.env.IS_SODOC = 'true'

  await $`pnpm add @alita/rspress-plugin@^1.5.0-beta.2 @shein/rspress-plugin-sodoc`
}

await $`rspress build`
