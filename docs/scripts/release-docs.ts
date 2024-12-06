import 'zx/globals'

$.verbose = true

const commitHash = (await $`git rev-parse --short HEAD`).stdout.replace(/(\n|,$)/g, '').trim()

await $`git tag doc-release/1.0.0/${commitHash}`

await $`git push gitlab main --tags`

await $`git tag -d doc-release/1.0.0/${commitHash}`
