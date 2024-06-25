import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

// TODO: re-write use import.meta.dirname
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const srcDir = path.resolve(__dirname, '../../src')
const targetPath = path.resolve(__dirname, '../src/pages/components/search/hooks.json')

const dirents = fs
  .readdirSync(srcDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && ['use-', 'create-'].some((e) => d.name.startsWith(e)))
  .map((e) => {
    const filePath = path.join(srcDir, e.name, 'index.mdx')

    if (!fs.existsSync(filePath))
      return {
        name: e.name,
        category: 'Utilities',
        features: [
          { name: 'Pausable', value: false },
          { name: 'IsSupported', value: false },
          { name: 'LowLevel', value: false },
          { name: 'DevOnly', value: false },
        ],
      }

    const typeLine =
      fs
        .readFileSync(filePath, 'utf-8')
        .split('\n')
        .filter((e) => e.includes('<HooksType'))[0] || ''

    const category = /category=(["'])(.+)?\1/.exec(typeLine)?.[2] || 'Uncategorized'

    const pausable = /pausable/.test(typeLine)
    const isSupported = /isSupported/.test(typeLine)
    const lowLevel = /lowLevel/.test(typeLine)
    const devOnly = /devOnly/.test(typeLine)

    return {
      name: e.name,
      category,
      features: [
        { name: 'Pausable', value: pausable },
        { name: 'IsSupported', value: isSupported },
        { name: 'LowLevel', value: lowLevel },
        { name: 'DevOnly', value: devOnly },
      ],
    }
  })

fs.writeFileSync(targetPath, JSON.stringify(dirents))

console.log(`Hooks data updated at ${new Date().toLocaleString()}`)
