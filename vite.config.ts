import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tsConfig from './tsconfig.json'

const tsPathAlias = Object.fromEntries(
  Object.entries(tsConfig.compilerOptions.paths).map(([find, replacement]) => {
    const currentPath = fileURLToPath(import.meta.url)
    const fullPath = resolve(dirname(currentPath), replacement[0])
    return [find, fullPath]
  })
)

export default defineConfig({
  resolve: {
    alias: {
      ...tsPathAlias,
    },
  },
})
