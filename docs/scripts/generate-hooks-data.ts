import 'zx/globals'

$.verbose = true

import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { camelCase } from 'change-case'
import grayMatter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const hooksSrc = resolve(__dirname, '../../packages/react-use/src')
const ignoredDirs = ['utils', 'use-track-ref-state', 'use-web-observer']

const dirents = await fs.readdir(hooksSrc, { withFileTypes: true })
const hooksDirents = dirents.filter((d) => d.isDirectory() && ignoredDirs.every((e) => e !== d.name))

const hooks: {
  name: string
  slug: string
  category: string
  features: string[]
  deprecated: boolean
}[] = []

for (const e of hooksDirents) {
  const mdxPath = join(hooksSrc, e.name, 'index.mdx')

  if (await fs.exists(mdxPath)) {
    const contents = await fs.readFile(mdxPath, 'utf-8')
    const { data } = grayMatter(contents)

    const category = data.type || data.category || 'Uncategorized'
    const features = data.features || []
    const deprecated = data.deprecated || false

    hooks.push({
      name: camelCase(e.name),
      slug: e.name,
      category,
      features,
      deprecated,
    })
  }
}

hooks.sort((a, b) => Number(a?.deprecated) - Number(b?.deprecated))

await fs.writeJson(resolve(__dirname, '../hooks.json'), hooks)
