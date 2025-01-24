#!/usr/bin/env zx
const path = require('path')

async function copyAssets() {
  const flavorName = "theme-1"
  const flavorDir = path.resolve('./build/flavor',flavorName)
  console.log(`>>>>>>>flavorDir ==== : ${flavorDir}`)

  //替换图片
  try {
    const sourceSrc = path.resolve(flavorDir,'./assets')
    console.log(`>>>>>>>sourceSrc ==== : ${sourceSrc}`)
    const destSrc = path.resolve(flavorDir,'../../../src/')
    console.log(`>>>>>>>destSrc ==== : ${destSrc}`)

  }catch (e) {
    console.log('替换图片 error:'+e)
  }
}


copyAssets().catch(e=>{})


// const getFlavor = (flavorRoot,flavorName)=>{
//   const flavorDir = path.resolve(flavorRoot,flavorName)
//   const flavorPath = path.resolve(flavorDir,'./theme-config.json')
//   return require(flavorPath)
// }


