const { exec } = require("./utils");

class WebpackLifeWatchPlugin{
    constructor(options){
    	this.options = options || {};
    }
    apply(compiler){
        compiler.hooks.done.tap("WebpackLifeWatchPlugin",compiler => {
            exec('adb', ['shell', 'am', 'broadcast', '-a', 'eskit.sdk.action.CODE_CHANGED', '-f', '32'])
        });
    }
}
module.exports = WebpackLifeWatchPlugin;
