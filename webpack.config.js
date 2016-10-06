module.exports = {
  context: __dirname,
  entry: './betterdgg/betterdgg.js',
  output: {
    filename: 'betterdgg-pack.js',
    library: 'BetterDGG',
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
      }
    ]
  },
  node: {
    fs: 'empty'
  }
};
