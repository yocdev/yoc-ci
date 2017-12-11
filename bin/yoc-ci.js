#!/usr/bin/env node

const program = require('commander')

program
  .version('0.0.1')
  .command('build', 'build').alias('b')
  .command('upload', 'upload').alias('u')
  .command('app-version', 'get app version infomation')
  .parse(process.argv)

