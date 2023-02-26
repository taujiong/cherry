import { readdir, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export function* getParentDirRecursively(dir: string) {
  let currentDir = dir
  let parentDir = dirname(currentDir)

  while (currentDir !== parentDir) {
    yield parentDir
    currentDir = parentDir
    parentDir = dirname(currentDir)
  }
}

export async function getFilesInDirRecursively(dir: string, pattern?: RegExp) {
  const files: string[] = []
  const children = await readdir(dir)
  const fileEntries = await Promise.all(
    children.map(async (child) => {
      const entry = join(dir, child)
      const entryStat = await stat(entry)
      if (entryStat.isDirectory()) return await getFilesInDirRecursively(entry)
      if (entryStat.isFile() && pattern?.test(entry)) return [entry]
      return []
    })
  )

  files.push(...fileEntries.flat())

  return files
}
