#!/usr/bin/env zx
const { exec } = require('shelljs');
const buildType = process.argv.slice(2).join(' ')
const cmd = process.platform.startsWith('win') ? 'gradlew.bat':'./gradlew'

async function build(){

  exec(`cd android && ${cmd} clean assemble${buildType}`,"")
}

build().catch(e=>{
  console.error(e)
})
