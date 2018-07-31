const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const getAndroidProperties = require('../util/getAndroidProperties')
const crypto = require('crypto')

async function publish(flavor) {
  const properties = await getAndroidProperties('release', flavor)
  if (!process.env.DOWNLOAD_HOST) {
    throw 'process.env.DOWNLOAD_HOST not found'
  }
  if (!process.env.PUBLISH_API_URL) {
    throw 'process.env.PUBLISH_API_URL not found'
  }
  if (!process.env.APP_SERVICE_TOKEN) {
    throw 'process.env.APP_SERVICE_TOKEN not found'
  }

  const fileName = `${properties.appName}-${flavor}-release-${properties.versionName}.apk`
  const apkFile = path.resolve(process.cwd(), fileName)
  const sha1 = await _calSHA1(apkFile)

  const url = `${process.env.PUBLISH_API_URL}/android/publish`
  const result = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      version: properties.versionName,
      versionCode: properties.versionCode,
      bundleId: properties.bundleId,
      extra: {
        android: {
          sha1,
          downloadUrl: `${process.env.DOWNLOAD_HOST}/${fileName}`
        }
      }
    }),
    headers: {
      'Authorization': `Bearer ${process.env.APP_SERVICE_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })
  if (!result.ok) {
    const body = await result.text()
    throw(`${result.status} ${result.statusText} ${body}`)
  }
}

async function _calSHA1(file) {
  return new Promise((resolve) => {
    fs.createReadStream(file)
      .pipe(crypto.createHash('sha1').setEncoding('hex'))
      .on('finish', function () {
        resolve(this.read())
      })
  })
}

module.exports = publish
