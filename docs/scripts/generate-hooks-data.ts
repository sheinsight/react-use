import fs from 'node:fs'
import path from 'node:path'
import { camelCase } from 'change-case'
import gm from 'gray-matter'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const hooksSrc = path.resolve(__dirname, '../../src')
const ignoredDirs = ['utils', 'use-track-ref-state', 'use-versioned-action']

const hooksDirents = fs
  .readdirSync(hooksSrc, { withFileTypes: true })
  .filter((d) => d.isDirectory() && ignoredDirs.every((e) => e !== d.name))

const hooks = hooksDirents
  .map((e) => {
    const mdxPath = path.resolve(hooksSrc, e.name, 'index.mdx')

    if (!fs.existsSync(mdxPath)) return null

    const { data } = gm(fs.readFileSync(mdxPath, 'utf-8'))
    const category = data.type || data.category || 'Uncategorized'
    const features = data.features || []
    const deprecated = data.deprecated || false

    return {
      name: camelCase(e.name),
      slug: e.name,
      category,
      features,
      deprecated,
    }
  })
  .filter(Boolean)
  .sort((a, b) => a?.deprecated - b?.deprecated)

fs.writeFileSync(path.resolve(__dirname, '../hooks.json'), JSON.stringify(hooks))
