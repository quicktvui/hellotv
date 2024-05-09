const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function getCurrentGitBranch() {
  return new Promise(resolve=>{
    exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
      if (err||stderr) {
        console.log('env-config-warning: getCurrentGitBranch-error')
        resolve('')
      } else {
        resolve(stdout.trim())//stdout.trim()
      }
    });
  })
}
const envConfig = {}
try {
  getCurrentGitBranch().then(cbranch=>{
    // console.log('-----env-config',process.argv) //'./scripts/hippy-webpack.dev.js'
    const isdev = process.argv.find(paitem=>paitem==='./scripts/hippy-webpack.dev.js')
    const relativePath = isdev ? './.env.dev.local' : './.env.build.local'

    const epath = path.resolve(relativePath)
    if(fs.existsSync(epath)){
      let fdata = fs.readFileSync(epath)
      if(fdata){
        fdata = fdata.toString().trim()
        if(fdata){
          fdata.split('\n').forEach(fdItem=>{
            if(!fdItem.startsWith('#')){
              const fdItemArr = fdItem.trim().split('=')
              if(fdItemArr&&fdItemArr.length>=2){
                let ckey = fdItemArr[0].trim()
                // console.log('-----env-config-ckey', ckey, '--', cbranch)
                if(ckey.startsWith('_')){
                  const kcbranch = `_${cbranch}_`
                  if(cbranch && ckey.startsWith(kcbranch)){
                    ckey = ckey.replace(kcbranch,'')
                    envConfig[ckey] = fdItemArr.slice(1).join('=').trim()
                  }
                } else {
                  envConfig[ckey] = fdItemArr.slice(1).join('=').trim()
                }
              }
            }
          })
        }
      }
    }
    // console.log('-----env-config',envConfig)
  })
} catch (error) {
  console.log('env-config-warning: ', error.message)
}
module.exports = envConfig