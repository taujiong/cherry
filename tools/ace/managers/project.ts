import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import type { ProjectConfig } from '../entities/project.js'
import { Project, PROJECT_CONFIG_FILE } from '../entities/project.js'
import type { Workspace } from '../entities/workspace.js'

export class ProjectManager {
  public projects: Project[] = []
  public constructor(private workspace: Workspace) {}

  public async initialize() {
    this.projects = await this.loadProjects()
  }

  private async loadProjects(rootDir: string = this.workspace.root) {
    if (rootDir !== this.workspace.root) {
      const projectOrNull = await this.tryLoadProject(rootDir)
      if (projectOrNull) return [projectOrNull]
    }
    const projects: Project[] = []
    const children = await readdir(rootDir)
    const projectList = await Promise.all(
      children.map(async (child) => {
        const entry = join(rootDir, child)
        const entryStat = await stat(entry)
        return entryStat.isDirectory() ? await this.loadProjects(entry) : []
      })
    )
    projects.push(...projectList.flat())

    return projects
  }

  private async tryLoadProject(root: string) {
    try {
      const file = join(root, PROJECT_CONFIG_FILE)
      const content = await readFile(file, 'utf8')
      const config = JSON.parse(content) as ProjectConfig
      return new Project(root, config)
    } catch {
      return null
    }
  }
}
