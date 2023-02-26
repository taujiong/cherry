import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { ViteNodeRunner } from 'vite-node/client'
import { ViteNodeServer } from 'vite-node/server'
import { installSourcemapsSupport } from 'vite-node/source-map'

const tsConfigContent = await readFile('./tsconfig.json', 'utf8')
const tsConfig = JSON.parse(tsConfigContent)
const tsPathAlias = Object.fromEntries(
  Object.entries(tsConfig.compilerOptions.paths).map(([find, replacement]) => {
    const currentPath = fileURLToPath(import.meta.url)
    const fullPath = resolve(dirname(currentPath), '../', replacement[0])
    return [find, fullPath]
  })
)

const server = await createServer({
  resolve: {
    alias: {
      ...tsPathAlias,
    },
  },
  optimizeDeps: {
    disabled: true,
  },
})

await server.pluginContainer.buildStart({})

const node = new ViteNodeServer(server)

installSourcemapsSupport({
  getSourceMap: (source) => node.getSourceMap(source),
})

const runner = new ViteNodeRunner({
  root: server.config.root,
  base: server.config.base,
  fetchModule(id) {
    return node.fetchModule(id)
  },
  resolveId(id, importer) {
    return node.resolveId(id, importer)
  },
})

await runner.executeFile('./tools/ace/cli.ts')

await server.close()
