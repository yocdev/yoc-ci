const shell = require('shelljs')

async function getVersionCode() {
  const result = await shell.exec('git rev-list --first-parent --count $(git rev-parse --abbrev-ref HEAD)')
  return result.stdout.trim()
}

async function getVersionName() {
  const result = await shell.exec('git describe --tags --dirty')
  return result.stdout.trim()
}

module.exports = {
  getVersionCode,
  getVersionName
}
