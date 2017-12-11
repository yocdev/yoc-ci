const shell = require('shelljs')
const getAndroidProperties = require('../util/getAndroidProperties')

async function build(buildType, clean) {
  const properties = await getAndroidProperties(buildType)

  await _decryptKeystore()
  await _agreeLicense()
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

async function _agreeLicense() {
  await shell.mkdir('-p "$ANDROID_SDK/licenses"')
  await shell.echo('-e "\n8933bad161af4178b1185d1a37fbf41ea5269c55\nd56f5187479451eabf01fb78af6dfcb131a6481e" > "$ANDROID_SDK/licenses/android-sdk-license"')
  await shell.echo('-e "\n84831b9409646a918e30573bab4c9c91346d8abd" > "$ANDROID_SDK/licenses/android-sdk-preview-license"')
  await shell.ls('"$ANDROID_SDK/licenses"')
  await shell.cat('"$ANDROID_SDK/licenses/android-sdk-license"')
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
