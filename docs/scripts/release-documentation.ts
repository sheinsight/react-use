import 'zx/globals'

const commitHash = (await $`git rev-parse --short HEAD`).stdout.replace(/(\n|,$)/g, '').trim()

await $`git tag doc-release/1.0.0/${commitHash}`
