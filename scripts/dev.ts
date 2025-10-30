#!/usr/bin/env zx
const run = require('./process')

async function dev() {
  await run(`tsx ./build/build-flavor.ts`, '')
  // await run(`eslint -c eslint.config.mjs`, '')
  await run(`hippy-dev -c ./scripts/quicktvui-webpack.dev.ts`, '')
}

dev().catch((e) => {
  console.error(e)
})
