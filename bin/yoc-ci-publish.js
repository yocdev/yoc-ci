const program = require('commander')
const publishAndroid = require('../src/publisher/android')

program
  .arguments('<platform> <flavor>')
  .action((platform, flavor) => {
    if (platform === 'android') {
      publishAndroid(flavor).catch(e => {
        console.error(e.toString())
        process.exit(1)
      })
    }
  })
  .parse(process.argv)
