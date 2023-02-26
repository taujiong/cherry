import type { CommandHandle } from 'ace'
import { getWorkspace } from 'ace'
import { filter } from 'rxjs'

const { commandManager } = getWorkspace()

const listCommandHandle: CommandHandle = (command$) =>
  command$.pipe(filter((command) => /^command list\s*$/.test(command))).subscribe(() => {
    const commands = commandManager.getAllCommands()
    const output = commands.map(({ name, description }) => `${name}: ${description}`).join('\n')
    console.log(output)
  })

commandManager.registerCommand({
  name: 'command list',
  description: 'list all the commands that has been registered',
  handle: listCommandHandle,
})
