#!/usr/bin/env node
const upload = require('../src/uploader/qiniu')
const program = require('commander')

program
  .arguments('<platform> <buildType> <flavor>')
  .action((platform, buildType, flavor) => {
    upload(platform, buildType, flavor)
  })
  .parse(process.argv)
