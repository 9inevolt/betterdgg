var DefinePlugin = require('webpack/lib/DefinePlugin');
var config = require('./webpack.base.config');

config.plugins.push(new DefinePlugin({
  DEBUG: true,
  VERSION: JSON.stringify('0')
}));

module.exports = config;
