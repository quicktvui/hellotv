#!/usr/bin/env zx
const fs = require('fs')
const path = require('path')
const run = require('./process')

async function build() {
  // 删除 dist/android 目录
  const androidDir = path.resolve('./dist/android/')
  if (fs.existsSync(androidDir)) {
    await run(`rm -rf ${androidDir}`)
  }

  // 创建 dist/android 目录
  fs.mkdirSync(androidDir, { recursive: true })

  // 删除 dist/android.zip 文件
  const androidZipFile = path.resolve('./dist/android.zip')
  if (fs.existsSync(androidZipFile)) {
    await run(`rm -rf ${androidZipFile}`)
  }

  // 构建 flavor
  await run(`tsx ./build/build-flavor.ts`)

  // 打包 Android 资源
  await run(`webpack --config ./scripts/quicktvui-webpack.android.ts`)

  // 生成 Android.zip, TODO: 命令执行成功, 但是没有生成 zip 文件
  // await run(`cd ${androidDir} && zip -r ../android.zip *`)
}

build().catch((e) => {
  console.error(e)
})
