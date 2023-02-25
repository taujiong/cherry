export interface ProjectConfig {
  name: string
}

export class Project {
  public name: string
  public constructor(public root: string, config: ProjectConfig) {
    this.name = config.name
  }
}
