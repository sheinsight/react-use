import 'zx/globals'

const commitHash = (await $`git rev-parse --short HEAD`).stdout.replace(/(\n|,$)/g, '').trim()
const pkgVersion = (await $`node -p "require('./package.json').version"`).stdout.replace(/(\n|,$)/g, '').trim()

await $`git tag doc-release/${pkgVersion}/${commitHash}`
await $`git push gitlab main --tags`
await $`git tag -d doc-release/${pkgVersion}/${commitHash}`
