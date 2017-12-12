#!/usr/bin/env node

const program = require('commander')

const buildAndroid = require('../src/builder/buildAndroid')

program
  .option('-c, --clean', 'clean')
  .option('--skip-license', 'skip license')
  .arguments('<platform> <buildType>')
  .action((platform, buildType) => {
    if (platform === 'android') {
      buildAndroid(buildType, {
        clean: program.clean,
        skipLicense: program.skipLicense
      }).catch((e) => {
        console.error(e)
        process.exit(1)
      })
    }
  })
  .parse(process.argv)
