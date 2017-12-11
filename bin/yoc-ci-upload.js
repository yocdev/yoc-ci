#!/usr/bin/env node
const path = require('path')
const upload = require('../src/uploader/qiniu')
const program = require('commander')

program
  .arguments('<platform> <buildType> <file>')
  .action((platform, buildType, file) => {
    const filePath = path.resolve(process.cwd(), file)
    upload(platform, buildType, filePath)
  })
  .parse(process.argv)
