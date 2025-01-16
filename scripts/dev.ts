#!/usr/bin/env zx
const run = require('./process')

async function dev() {
  await run(`hippy-dev -c ./scripts/quicktvui-webpack.dev.ts`, '')
}

dev().catch((e) => {
  console.error(e)
})
