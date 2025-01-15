#!/usr/bin/env zx
const compressing = require('compressing')
const fs = require('node:fs')
const path = require('path')
const run = require('./process')

async function pack() {
  await run(`webpack --config ./scripts/quicktvui-webpack.android.ts`, '')
  const cwd = process.cwd()
  const dist = path.join(cwd, './dist')
  const android = path.join(cwd, './dist/android')
  const pkgFile = path.join(cwd, './package.json')
  const packages = JSON.parse(fs.readFileSync(pkgFile, 'utf8'))
  const rpkPath = path.resolve(dist, encodeURIComponent(packages.name) + '.rpk')
  await compressing.zip.compressDir(android, rpkPath)
}

pack().catch((e) => {
  console.error(e)
})
