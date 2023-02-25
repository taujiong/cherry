import { Workspace } from './entities/workspace.js'
import { findWorkspaceRoot } from './utils/workspace.js'

const workspaceRoot = await findWorkspaceRoot()
if (!workspaceRoot) {
  console.log('no workspace found, exit')
  process.exit(1)
}
const workspace = new Workspace(workspaceRoot)
await workspace.loadProjects()
console.log(workspace)
