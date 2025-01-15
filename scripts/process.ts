const { spawn } = require('child_process')

const run = async (command, cwd) => {
  const [cmd, ...args] = command.split(' ')
  const app = spawn(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })

  const onProcessExit = () => app.kill('SIGHUP')

  app.on('close', (code) => {
    process.removeListener('exit', onProcessExit)
    if (code === 0) {
      console.error(`Command succeeded. \n Command: ${command} \n Code: ${code}`)
    } else {
      console.error(`Command failed. \n Command: ${command} \n Code: ${code}`)
    }
  })
  process.on('exit', onProcessExit)
}

module.exports = run
