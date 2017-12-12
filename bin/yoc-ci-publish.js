const program = require('commander')
const publishAndroid = require('../src/publisher/android')

program
  .arguments('<platform>')
  .action((platform) => {
    if (platform === 'android') {
      publishAndroid().catch(e => {
        console.error(e.toString())
        process.exit(1)
      })
    }
  })
  .parse(process.argv)
