const shell = require('shelljs')
const getAndroidProperties = require('../util/getAndroidProperties')

async function build(buildType, clean) {
  const properties = await getAndroidProperties(buildType)

  await _decryptKeystore()
  await _execGradleCmd(buildType, clean)

  const apkName = await _getApkName(properties.appName, buildType, properties.versionName)
  const result = await shell.mv(
    _apkFullPath(`app-${buildType}.apk`),
    apkName
  )
  if (result.code != 0) {
    process.exit(1)
  }
}

async function _decryptKeystore() {
  const result = await shell.exec(`
  openssl enc -d -aes-256-cbc \
  -pass "pass:${process.env.ANDROID_KEYSTORE_PASS}" \
  -in keystores/jellyfish.jks.enc \
  -md md5 \
  -out release.keystore
  `)
  if (result.code != 0) {
    process.exit(1)
  }
}

async function _execGradleCmd(buildType, clean) {
  let cmd = './gradlew'
  if (clean) {
    cmd += ' clean'
  }
  cmd += ` assemble${_capitalize(buildType)}`
  const result = await shell.exec(cmd)
  if (result.code != 0) {
    process.exit(1)
  }
}

function _apkFullPath(apkName) {
  return`${process.cwd()}/app/build/outputs/apk/${apkName}`
}

function _getApkName(appName, buildType, versionName) {
  return `${appName}-${buildType}-${versionName}.apk`
}

function _capitalize(str) {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  return str
}

module.exports = build
