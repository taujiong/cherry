import { lookupProjectRoots } from './entities/project.js'
import { findWorkspaceRoot } from './entities/workspace.js'

const workspaceRoot = await findWorkspaceRoot()
if (!workspaceRoot) {
  console.log('no workspace found, exit')
  process.exit(1)
}
const projectRoots = await lookupProjectRoots(workspaceRoot)
console.log(projectRoots)
