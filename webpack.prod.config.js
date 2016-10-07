var DefinePlugin = require('webpack/lib/DefinePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var package = require('./package.json');
var config = require('./webpack.base.config');

config.plugins.push(new DefinePlugin({
  DEBUG: false,
  VERSION: JSON.stringify(package.version)
}));
config.plugins.push(new UglifyJsPlugin());

module.exports = config;
