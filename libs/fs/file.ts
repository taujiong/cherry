import { access } from 'fs/promises'
import { join } from 'node:path'

export function fileExists(file: string): Promise<boolean> {
  return new Promise((resolve) => {
    access(file)
      .then(() => resolve(true))
      .catch(() => resolve(false))
  })
}

export function hasFileInDir(file: string, dir: string) {
  return fileExists(join(dir, file))
}
