import { hasFileInDir } from '@/fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'path'
import type { ProjectConfig } from '../entities/project.js'
import { PROJECT_CONFIG_FILE } from '../entities/project.js'

export async function lookupProjectRoots(rootDir = process.cwd()) {
  const isProjectRoot = await hasFileInDir(PROJECT_CONFIG_FILE, rootDir)
  if (isProjectRoot) return [rootDir]

  const roots: string[] = []
  const children = await readdir(rootDir)
  const entries = await Promise.all(
    children.map(async (child) => {
      const entry = join(rootDir, child)
      const entryStat = await stat(entry)
      return entryStat.isDirectory() ? await lookupProjectRoots(entry) : []
    })
  )

  roots.push(...entries.flat())

  return roots
}

export async function loadProjectConfig(root: string) {
  const configFile = join(root, PROJECT_CONFIG_FILE)
  const content = await readFile(configFile, 'utf8')
  return JSON.parse(content) as ProjectConfig
}
