const shell = require('shelljs')
const getAndroidProperties = require('../util/getAndroidProperties')

async function build(buildType, flavor, options) {
  const properties = await getAndroidProperties(buildType, flavor)
  const { clean, skipLicense } = options

  await _decryptKeystore()
  if (!skipLicense) {
    await _agreeLicense()
  }
  await _execGradleCmd(buildType, flavor, clean)

  const apkName = await _getApkName(properties.appName, buildType, flavor, properties.versionName)
  let buildedApkName
  if (flavor) {
    buildedApkName = `app-${flavor}-${buildType}.apk`
  } else {
    buildedApkName = `app-${buildType}.apk`
  }
  const result = await shell.mv(
    _apkFullPath(buildedApkName, flavor, buildType),
    apkName
  )
  if (result.code != 0) {
    process.exit(1)
  }

  console.log('build apk:', `${process.cwd()}/${apkName}`)
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
  const result = await shell.exec(`
    mkdir -p "$ANDROID_SDK/licenses"
    echo -e "\n8933bad161af4178b1185d1a37fbf41ea5269c55\nd56f5187479451eabf01fb78af6dfcb131a6481e" > "$ANDROID_SDK/licenses/android-sdk-license"
    echo -e "\n84831b9409646a918e30573bab4c9c91346d8abd" > "$ANDROID_SDK/licenses/android-sdk-preview-license"
    ls "$ANDROID_SDK/licenses"
    cat "$ANDROID_SDK/licenses/android-sdk-license"
  `)
  if (result.code != 0) {
    process.exit(1)
  }
}

async function _execGradleCmd(buildType, flavor, clean) {
  let cmd = './gradlew'
  if (clean) {
    cmd += ' clean'
  }
  if (flavor) {
    cmd += ` assemble${_capitalize(flavor)}${_capitalize(buildType)}`
  } else {
    cmd += ` assemble${_capitalize(buildType)}`
  }
  const result = await shell.exec(cmd)
  if (result.code != 0) {
    process.exit(1)
  }
}

function _apkFullPath(apkName, flavor, buildType) {
  return`${process.cwd()}/app/build/outputs/apk/${flavor}/${buildType}/${apkName}`
}

function _getApkName(appName, buildType, flavor, versionName) {
  if (flavor) {
    return `${appName}-${flavor}-${buildType}-${versionName}.apk`
  } else {
    return `${appName}-${buildType}-${versionName}.apk`
  }
}

function _capitalize(str) {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  return str
}

module.exports = build
