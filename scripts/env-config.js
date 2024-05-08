const fs = require('fs');
const path = require('path');

const envConfig = {}
try {
  // console.log('-----env-config',process.argv)
  const isdev = process.argv.find(paitem=>paitem==='./scripts/hippy-webpack.dev.js')
  // './scripts/hippy-webpack.dev.js'
  const relativePath = isdev?'./.env.dev.local':'./.env.build.local'
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
              envConfig[fdItemArr[0].trim()] = fdItemArr.slice(1).join('=').trim()
            }
          }
        })
      }
    }
  }
  // console.log('-----env-config',envConfig)
} catch (error) {
  console.log('env-config-warning: ', error.message)
}
module.exports = envConfig