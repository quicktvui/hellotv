const path = require('path');
/** override flavor**/
function getFlavor(flavorRoot,flavorName){
  let flavorDir = path.resolve(flavorRoot,flavorName)
  let flavorPath = path.resolve(flavorDir,'./config.json')
  console.log(`>>>>>>>buildFlavor : ${flavorName},path:${flavorPath},flavorDir:${flavorDir}`)
  return require(flavorPath)
}

function getFlavorDir(flavorRoot,flavorName){
  return path.resolve(flavorRoot, flavorName)
}
module.exports={
  getFlavor,getFlavorDir
}
