const { spawn } = require('child_process')

const run = (command, cwd) => {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd,
      stdio: ['inherit', 'inherit', 'pipe'], // Capture stderr separately
      shell: process.platform === 'win32'
    })

    let errorOutput = ''

    app.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)
      if (code === 0) {
        resolve({})
      } else {
        console.error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        console.error(`Error output: ${errorOutput}`)
        reject(new Error(`Command failed with code ${code}`))
      }
    })
    process.on('exit', onProcessExit)
  })
}

module.exports = run
