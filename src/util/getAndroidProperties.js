const readProperties = require('properties-reader')
const version = require('./version')

async function getAndroidProperties(buildType) {
  const properties = readProperties(`env/${buildType}`)

  const versionName = await version.getVersionName()
  const versionCode = await version.getVersionCode()
  const appName = properties.get('APP_NAME')

  const result = {
    appName,
    versionName,
    versionCode
  }

  for (const key in result) {
    if (!result[key]) {
      throw `${key} not found`
    }
  }

  return result

}

module.exports = getAndroidProperties
