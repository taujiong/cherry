import { dirname } from 'node:path'

export function* getParentDirRecursively(dir: string) {
  let currentDir = dir
  let parentDir = dirname(currentDir)

  while (currentDir !== parentDir) {
    yield parentDir
    currentDir = parentDir
    parentDir = dirname(currentDir)
  }
}
