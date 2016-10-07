var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require('glob');
var path = require('path');

var workDir = path.join(__dirname, '/betterdgg');

module.exports = {
  context: workDir,
  entry: {
    injected: glob.sync('./betterdgg.{js,css}', { cwd: workDir }),
    betterdgg: glob.sync('./content-scripts/*.js', { cwd: workDir })
  },
  output: {
    filename: '[name].js',
    path: './build'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: [
            ['es2015', { loose: true, modules: false }]
          ]
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader')
      },
      {
        test: /\.(png|gif)$/,
        loader: 'file-loader',
        query: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader'
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'betterdgg.css', allChunks: true })
  ]
};
