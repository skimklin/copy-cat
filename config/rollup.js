var typescript = require('rollup-plugin-typescript2')
var babel = require('rollup-plugin-babel')

var pkg = require('../package.json')

// compatible with copy-cat and @skimklin/copy-cat
// @skimklin/copy-cat -> copy-cat
var name = pkg.name.split('/').pop()
// @skimklin/copy-cat -> skimklin_copy-cat
// var name = pkg.name.replace('@', '').replace(/\//g, '_');
var version = pkg.version

var banner = `/*!
 * ${pkg.name} ${version} (https://github.com/skimklin/copy-cat)
 * API https://github.com/skimklin/copy-cat/blob/master/doc/api.md
 * Copyright 2017-${new Date().getFullYear()} skimklin. All Rights Reserved
 * Licensed under MIT (https://github.com/skimklin/copy-cat/blob/master/LICENSE)
 */
`

var type = 'ts'

function getCompiler(opt) {
  opt = opt || {
    tsconfigOverride: { compilerOptions: { module: 'ES2015' } }
  }

  return typescript(opt)
}

exports.type = type
exports.name = name
exports.banner = banner
exports.getCompiler = getCompiler
