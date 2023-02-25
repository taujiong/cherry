import { hasFileInDir } from '@/fs'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const PROJECT_CONFIG_FILE = 'ace.project.json'

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
