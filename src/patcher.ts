import fs from 'fs'
import path from 'path'
const Module = require('module') // typescript 'import' brokes Module

export default class Patcher {
  public get patched () {
    return !!this.compile
  }

  private parent: NodeModule
  private compile: Function
  private exports: any

  constructor (parent: NodeModule, patch = true) {
    this.parent = parent
    this.compile = null
    this.exports = {}

    if (patch) this.patch()
  }

  public export (request: string, v: string, { name = v, uncache = true } = {}) {
    const filename = this.resolveFilename(request)

    this.exports[filename] = { ...this.exports[filename], [v]: name }
    if (uncache) delete require.cache[filename]
  }

  public unexport (request: string, v = null) {
    const filename = this.resolveFilename(request)

    if (this.exports[filename]) {
      if (v) {
        delete this.exports[filename][v]
      } else {
        this.exports[filename] = {}
      }
    }
  }

  public patch (separator = '\n;') {
    if (this.patched) this.unpatch()

    const compile = Module.prototype._compile
    this.compile = compile

    const patcher = this

    Module.prototype._compile = function (content, filename: string) {
      const source = patcher.source(filename)
      return compile.call(
        this,
        source ? `${content}${separator}${source}` : content,
        filename
      )
    }
  }

  public unpatch () {
    if (!this.patched) return

    Module.prototype._compile = this.compile
    this.compile = null
  }

  private resolveFilename (
    request: string,
    parent = this.parent,
    isMain = false,
    options: any = {}
  ) {
    if (path.isAbsolute(request) && fs.existsSync(request)) return request
    return Module._resolveFilename(request, parent, isMain, options)
  }

  private source (filename: string) {
    return Object.entries(this.exports[filename] || {})
      .map(([v, name]) => `module.exports[${JSON.stringify(name)}]=${v}`)
      .join(';')
  }
}
