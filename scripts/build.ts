#!/usr/bin/env zx
const run = require('./process')

async function build() {
  await run(`tsx ./build/build-flavor.ts`, '')
  await run(`webpack --config ./scripts/quicktvui-webpack.android.ts`, '')
}

build().catch((e) => {
  console.error(e)
})
