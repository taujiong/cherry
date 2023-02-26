import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getParentDirRecursively } from '../../libs/fs/dir.js'
import type { WorkspaceConfig } from './entities/workspace.js'
import { Workspace, WORKSPACE_CONFIG_FILE } from './entities/workspace.js'
export * from './entities/project.js'
export * from './entities/workspace.js'
export * from './managers/command.js'
export * from './managers/project.js'

let workspace: Workspace

export async function createWorkspace(workingDir = process.cwd()) {
  const workspaceOrNull = await tryLoadWorkspace(workingDir)
  if (!workspaceOrNull) {
    throw new Error('no workspace found')
  }

  workspace = workspaceOrNull
  await workspace.initialze()

  return workspace
}

export function getWorkspace() {
  if (workspace) return workspace
  throw new Error('workspace has not been created yet, invoke createWorkspace first')
}

async function tryLoadWorkspace(startDir: string) {
  const tryCreateWorkspace = async (root: string) => {
    try {
      const file = join(root, WORKSPACE_CONFIG_FILE)
      const content = await readFile(file, 'utf8')
      const config = JSON.parse(content) as WorkspaceConfig
      return new Workspace(root, config)
    } catch {
      return null
    }
  }

  const workspaceOrNull = await tryCreateWorkspace(startDir)
  if (workspaceOrNull) return workspaceOrNull

  for (const dir of getParentDirRecursively(startDir)) {
    const workspaceOrNull = await tryCreateWorkspace(dir)
    if (workspaceOrNull) return workspaceOrNull
  }

  return null
}
