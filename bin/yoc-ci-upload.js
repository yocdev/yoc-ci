#!/usr/bin/env node
const upload = require('./upload')
const program = require('commander')

program
  .arguments('<platform> <file>')
  .action((platform, file) => {
    upload(platform, file)
  })
  .parse(process.argv)
