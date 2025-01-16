const run = require('./process.ts')

class WebpackLifeWatchPlugin {
  constructor(options) {
    this.options = options || {}
  }

  apply(compiler) {
    compiler.hooks.done.tap('WebpackLifeWatchPlugin', (compiler) => {
      setTimeout(() => {
        this.broadcast()
      }, 2000)
    })
  }

  async broadcast() {
    await run(`adb shell am broadcast -a eskit.sdk.action.CODE_CHANGED -f 32`, '')
  }
}

module.exports = WebpackLifeWatchPlugin
