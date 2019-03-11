const Module = require('module') // typescript 'import' brokes Module

declare global {
  namespace NodeJS {
    interface Global {
      locals: GlobalPatcher
    }
  }
}

export default class GlobalPatcher {
  public separator = '\n;'

  public compile: Function

  private exports: {
    [filename: string]: Array<{ variable: string; name: string }>;
  } = {}

  public export (filename: string, variable: string, name: string) {
    if (this.hasVariable(filename, variable, name)) return

    const variables = this.getVariables(filename)

    variables.push({ variable, name })
  }

  public unexport (filename: string, variable: string, name: string) {
    if (!variable) this.getVariables(filename).splice(0)

    if (!this.hasVariable(filename, variable, name)) return

    const index = this.getVariableIndex(filename, variable, name)
    const variables = this.getVariables(filename)

    variables.splice(index, 1)
  }

  public patch () {
    if (global.locals) return false

    this.compile = Module.prototype._compile

    const patcher = this

    Module.prototype._compile = function (content: string, filename: string) {
      const source = patcher.source(filename)

      if (source) content += patcher.separator + source

      return patcher.compile.call(this, content, filename)
    }

    global.locals = patcher

    return true
  }

  public unpatch () {
    Module.prototype._compile = this.compile

    delete global.locals
  }

  public source (filename: string) {
    return this.getVariables(filename)
      .map(
        ({ variable, name }) => `exports[${JSON.stringify(name)}]=${variable}`
      )
      .join(';')
  }

  private hasVariable (filename: string, variable: string, name: string) {
    return this.getVariableIndex(filename, variable, name) > -1
  }

  private getVariableIndex (filename: string, variable: string, name: string) {
    return this.getVariables(filename).findIndex(
      ({ variable: $variable, name: $name }) =>
        $variable === variable && $name === name
    )
  }

  private getVariables (filename: string) {
    if (!this.exports[filename]) this.exports[filename] = []

    return this.exports[filename]
  }
}
