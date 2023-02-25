import { loadProjectConfig, lookupProjectRoots } from '../utils/project.js'
import { Project } from './project.js'

export const WORKSPACE_CONFIG_FILE = 'ace.workspace.json'

export class Workspace {
  public projects: Project[] = []

  public constructor(public root: string) {}

  public async loadProjects() {
    const projectRoots = await lookupProjectRoots(this.root)
    this.projects = await Promise.all(
      projectRoots.map(async (root) => {
        const config = await loadProjectConfig(root)
        return new Project(root, config)
      })
    )
  }
}
