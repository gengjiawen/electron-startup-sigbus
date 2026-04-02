const { spawn } = require('node:child_process')
const { join } = require('node:path')

const electronBinary = join(__dirname, '..', 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron')
const child = spawn(electronBinary, ['out/main/index.js'], {
  cwd: join(__dirname, '..'),
  stdio: 'inherit'
})

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`electron exited with signal ${signal}`)
    process.exitCode = 1
    return
  }

  console.error(`electron exited with code ${code ?? 'unknown'}`)
  process.exitCode = code ?? 1
})

child.on('error', (error) => {
  console.error(error)
  process.exitCode = 1
})
