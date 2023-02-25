import { getParentDirRecursively, hasFileInDir } from '@/fs'
import { ProjectManager } from '../managers/project.js'

const WORKSPACE_CONFIG_FILE = 'ace.workspace.json'

export class Workspace {
  public porjectManager: ProjectManager

  public constructor(public root: string) {
    this.porjectManager = new ProjectManager(this)
  }

  public async initialze() {
    await this.porjectManager.initialize()
  }
}

export async function createWorkspace(workingDir = process.cwd()) {
  const workspaceRoot = await findWorkspaceRoot(workingDir)
  if (!workspaceRoot) {
    console.log('no workspace found, exit')
    process.exit(1)
  }
  const workspace = new Workspace(workspaceRoot)
  await workspace.initialze()

  return workspace
}

async function findWorkspaceRoot(startDir: string) {
  const isRoot = await hasFileInDir(WORKSPACE_CONFIG_FILE, startDir)
  if (isRoot) return startDir

  for (const dir of getParentDirRecursively(startDir)) {
    const isRoot = await hasFileInDir(WORKSPACE_CONFIG_FILE, startDir)
    if (isRoot) return dir
  }

  return null
}
