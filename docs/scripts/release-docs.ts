import 'zx/globals'

const commitHash = (await $`git rev-parse --short HEAD`).stdout.replace(/(\n|,$)/g, '').trim()
const latestTag = (await $`git describe --tags --abbrev=0`).stdout.replace(/(\n|,$)/g, '').trim()

await $`git tag doc-release/${latestTag}/${commitHash}`
await $`git push gitlab main --tags`
await $`git tag -d doc-release/${latestTag}/${commitHash}`
