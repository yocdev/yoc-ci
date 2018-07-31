const qiniu = require('qiniu')
const getAndroidProperties = require('../util/getAndroidProperties')
const path = require('path')

function _uptoken (bucket, key) {
  const accessKey = process.env.QINIU_ACCESS_KEY
  const secretKey = process.env.QINIU_SECRET_KEY

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const options = {
    scope: `${bucket}:${key}`
  }

  const putPolicy = new qiniu.rs.PutPolicy(options)
  return putPolicy.uploadToken(mac)
}

function _doUpload(bucket, file, fileName) {
  return new Promise((resolve, reject) => {
    // seen as key, read as fileName in server
    console.log('[uploadQiniu] Uploading to %s: %s', bucket, fileName)

    const config = new qiniu.conf.Config()
    config.zone = qiniu.zone.Zone_z0

    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    const uploadToken = _uptoken(bucket, fileName)

    formUploader.putFile(uploadToken, fileName, file, putExtra, (err, respBody) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log(respBody)
        resolve(respBody)
      }
    })
  })
}

async function upload(platform, buildType, flavor) {
  let appFileName
  if (platform === 'android') {
    const { appName, versionName } = await getAndroidProperties(buildType, flavor)
    appFileName = `${appName}-${flavor}-${buildType}-${versionName}.apk`
  }

  if (!appFileName) {
    throw 'app file name not found'
  }

  try {
    _doUpload('yocdownload', path.resolve(process.cwd(), appFileName), appFileName)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

module.exports = upload
