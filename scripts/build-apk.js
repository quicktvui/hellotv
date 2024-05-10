const { exec } = require('shelljs');

const buildType = process.argv.slice(2).join(' ');

const cmd = process.platform.startsWith('win') ? 'gradlew.bat' : './gradlew'

exec(`cd android && ${cmd} clean assemble${buildType}`)