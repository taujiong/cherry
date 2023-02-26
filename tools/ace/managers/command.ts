import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Observable, Subscription } from 'rxjs'
import { fromEvent, map } from 'rxjs'
import { getFilesInDirRecursively } from '../../../libs/fs/dir.js'
import type { Workspace } from '../entities/workspace.js'

export type CommandHandle = (command$: Observable<string>) => Subscription

export interface CommandRegistrant {
  name: string
  description?: string
  handle: CommandHandle
}

interface CommandRegistrantResult {
  name: string
  description?: string
  subscription: Subscription
}

export class CommandManager {
  private command$: Observable<string>
  private commandDir: string
  private commandRegistrantMap = new Map<string, CommandRegistrantResult>()

  public constructor(private workspace: Workspace) {
    this.command$ = (fromEvent(process.stdin, 'data') as Observable<Buffer>).pipe(
      map((buf) => buf.toString('utf8').trim())
    )
    this.commandDir = join(this.workspace.extensionDir, './commands')
  }

  public async initialize() {
    await this.loadCommands()
  }

  private async loadCommands() {
    const commandFiles = await getFilesInDirRecursively(this.commandDir, /.[cm]?[jt]s$/)
    const moduleUrls = commandFiles.map((file) => pathToFileURL(file))
    await Promise.all(moduleUrls.map((url) => import(/* @vite-ignore */ url.href)))
  }

  public registerCommand(...registrants: CommandRegistrant[]) {
    for (const registrant of registrants) {
      const registeredCommand = this.commandRegistrantMap.get(registrant.name)
      if (registeredCommand) {
        console.log(`command with name ${registrant.name} has been registered`)
        if (registeredCommand.description) {
          console.log(
            `the description of the registered command is:\n${registeredCommand.description}`
          )
        } else {
          console.log('the registered command has no description')
        }
        continue
      }

      const subscription = registrant.handle(this.command$)
      this.commandRegistrantMap.set(registrant.name, {
        name: registrant.name,
        description: registrant.description,
        subscription: subscription,
      })
    }
  }

  public getAllCommands() {
    return Array.from(this.commandRegistrantMap.values()).map((result) => ({
      name: result.name,
      description: result.description ?? 'the command has no description',
    }))
  }
}
