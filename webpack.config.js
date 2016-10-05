module.exports = {
    context: __dirname,
    entry: './betterdgg/betterdgg.js',
    output: {
        filename: 'betterdgg-pack.js',
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
    }
};
