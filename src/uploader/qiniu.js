const qiniu = require('qiniu')

const uptoken = function (bucket, key) {
  const putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key)
  return putPolicy.token()
}

function uploadQiniu(bucket, fileName) {
  qiniu.conf.ACCESS_KEY = process.env.QINIU_ACCESS_KEY
  qiniu.conf.SECRET_KEY = process.env.QINIU_SECRET_KEY

  return new Promise((resolve, reject) => {
    // seen as key, read as fileName in server
    console.log('[uploadQiniu] Uploading to %s: %s', bucket, fileName)
    const token = uptoken(bucket, fileName)
    qiniu.io.putFile(token, fileName, file, null, (err, resp) => {
      if (err) {
        reject(err)
      } else {
        resolve(resp)
      }
    })
  })
}

function upload(platform, file) {

}

module.exports = upload
