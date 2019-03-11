import fs from 'fs'
import path from 'path'
const Module = require('module')

import GlobalPatcher from './global'
if (!(global as any).locals) {
  new GlobalPatcher().patch()
}

class LocalPatcher {
  public parent = module.parent

  public export (request: string, variable: string, name = variable) {
    const filename = this.resolveFilename(request)

    global.locals.export(filename, variable, name)
    delete require.cache[filename]
  }

  public unexport (request: string, variable: string = null, name = variable) {
    const filename = this.resolveFilename(request)

    global.locals.unexport(filename, variable, name)
  }

  private resolveFilename (request: string) {
    if (path.isAbsolute(request) && fs.existsSync(request)) return request
    return Module._resolveFilename(request, this.parent, false)
  }
}

module.exports = new LocalPatcher()
delete require.cache[__filename]
