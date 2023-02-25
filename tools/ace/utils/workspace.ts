import { getParentDirRecursively, hasFileInDir } from '@/fs'
import { WORKSPACE_CONFIG_FILE } from '../entities/workspace.js'

export async function findWorkspaceRoot(startDir = process.cwd()) {
  const isRoot = await hasFileInDir(WORKSPACE_CONFIG_FILE, startDir)
  if (isRoot) return startDir

  for (const dir of getParentDirRecursively(startDir)) {
    const isRoot = await hasFileInDir(WORKSPACE_CONFIG_FILE, startDir)
    if (isRoot) return dir
  }

  return null
}
