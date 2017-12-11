#!/usr/bin/env node
const upload = require('../src/uploader/qiniu')
const program = require('commander')

program
  .arguments('<platform> <buildType>')
  .action((platform, buildType) => {
    upload(platform, buildType)
  })
  .parse(process.argv)
