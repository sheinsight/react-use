import 'zx/globals'

const isSoDoc = process.env.PIPLINENAME === 'SODOC'

process.env.IS_SODOC = isSoDoc ? 'true' : undefined

if (isSoDoc) {
  await $`pnpm add @shein/rspress-plugin-sodoc`
}

await $`rspress build`
