var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require('glob');
var path = require('path');

var workDir = path.join(__dirname, '/betterdgg');

module.exports = {
  context: workDir,
  entry: {
    injected: glob.sync('./betterdgg.{js,css}', { cwd: workDir }),
    betterdgg: glob.sync('./content-scripts/*.js', { cwd: workDir }),
    background: '../chrome/lib/background.js'
  },
  output: {
    filename: '[name].js',
    path: './build'
  },
  resolve: {
    modules: [
      path.resolve('./betterdgg'),
      path.resolve('./node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
        test: /\.(png|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'betterdgg.css', allChunks: true }),
    new CopyWebpackPlugin([
        {
          from: 'node_modules/twemoji/2/svg',
          to: 'images/emoji',
          context: __dirname
        },
        {
          from: 'node_modules/emojione/assets/svg',
          to: 'images/emojione',
          context: __dirname
        }
    ])
  ]
};
