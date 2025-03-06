#!/usr/bin/env zx
const path = require('path')
const fs   = require('fs')
const { execSync } = require('child_process');
const themeFileName = "theme-1"
/**
 * 替换资源图片
 */
async function copyAssets() {
  //替换图片
  try {
    console.log(`>>>>>>>替换图片 ==== : start`)
    const sourceDir = path.resolve('./build/flavor',`${themeFileName}/assets`)
    console.log(`>>>>>>>sourceDir ==== : ${sourceDir}`)
    const destSrc = path.resolve(sourceDir,'../../../../src/')
    console.log(`>>>>>>>destSrc ==== : ${destSrc}`)
    fs.statSync(sourceDir)
    execSync(`cp -r ${sourceDir} ${destSrc}`)
    console.log(`>>>>>>>替换图片 ==== : success`)
  }catch (e) {
    console.log('替换图片 error:'+e)
  }
}

/**
 * 替换Scss主题文件
 */
async function buildTheme(){
  try {
    console.log(`>>>>>>>更换主题文件 ==== : start`)
    const themeDir = path.resolve('./build/flavor',`${themeFileName}/config`)
    console.log(`>>>>>>>themeConfigPath ==== : ${themeDir}`)
    const themeConfig = path.resolve(themeDir,'../../../../src/')
    console.log(`>>>>>>>sourceSrc ==== : ${themeConfig}`)
    fs.statSync(themeDir)
    execSync(`cp -r ${themeDir} ${themeConfig}`)
    console.log(`>>>>>>>更换主题文件 ==== : success`)
  }catch (e) {
    console.log('更换主题色 error:'+e)
  }

}

copyAssets().catch(e=>{})
buildTheme().catch(e=>{})

