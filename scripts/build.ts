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
  const bundleDir = path.resolve('./dist/bundle/')
  const bundleZipFile = path.resolve('./dist/bundle.zip')

  // 删除 dist/bundle 目录
  await removeDir(bundleDir)

  // 创建 dist/bundle 目录
  fs.mkdirSync(bundleDir, { recursive: true })

  // 删除 dist/bundle.zip 文件
  await removeFile(bundleZipFile)

  // 构建 flavor
  await run('tsx ./build/build-flavor.ts')

  // 打包 bundle 资源
  await run('webpack --config ./scripts/quicktvui-webpack.prod.ts')

  // 生成 bundle.zip
  await zipDirectory(bundleDir, bundleZipFile)

  console.log('✅ bundle.zip 已生成:', bundleZipFile)
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
