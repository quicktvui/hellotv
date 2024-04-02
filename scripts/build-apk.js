const { exec } = require('shelljs');

const buildType = process.argv.slice(2).join(' ');

exec(`cd android && ./gradlew clean assemble${buildType}`)