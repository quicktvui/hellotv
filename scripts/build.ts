#!/usr/bin/env zx
const fs = require('fs')
const path = require('path')
const run = require('./process')
const archiver = require('archiver')

async function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    await fs.promises.rm(dirPath, { recursive: true, force: true })
  }
}

async function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    await fs.promises.rm(filePath, { force: true })
  }
}

async function zipDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve())
    archive.on('error', err => reject(err))

    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}

async function build() {
  const androidDir = path.resolve('./dist/android/')
  const androidZipFile = path.resolve('./dist/android.zip')

  // 删除 dist/android 目录
  await removeDir(androidDir)

  // 创建 dist/android 目录
  fs.mkdirSync(androidDir, { recursive: true })

  // 删除 dist/android.zip 文件
  await removeFile(androidZipFile)

  // 构建 flavor
  await run('tsx ./build/build-flavor.ts')

  // 打包 Android 资源
  await run('webpack --config ./scripts/quicktvui-webpack.android.ts')

  // 生成 Android.zip
  await zipDirectory(androidDir, androidZipFile)

  console.log('✅ Android.zip 已生成:', androidZipFile)
}

// 仅在直接执行该文件时运行
if (require.main === module) {
  build().catch(err => {
    console.error('❌ 构建失败:', err)
    process.exit(1)
  })
}

build().catch((e) => {
  console.error(e)
})
