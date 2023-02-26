import { join } from 'node:path'
import { CommandManager } from '../managers/command.js'
import { ProjectManager } from '../managers/project.js'

export const WORKSPACE_CONFIG_FILE = 'ace.workspace.json'

export interface WorkspaceConfig {
  extensionDir?: string
}

export class Workspace {
  public porjectManager: ProjectManager
  public commandManager: CommandManager

  public constructor(public root: string, public config: WorkspaceConfig) {
    this.porjectManager = new ProjectManager(this)
    this.commandManager = new CommandManager(this)
  }

  public get extensionDir() {
    return this.config.extensionDir ?? join(this.root, './extensions')
  }

  public async initialze() {
    await this.porjectManager.initialize()
    await this.commandManager.initialize()
  }
}
