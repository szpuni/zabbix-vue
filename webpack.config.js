var webpack = require('webpack')

function isExternal(module) {
    var context = module.context;

    if (typeof context !== 'string') {
    return false;
    }

    return context.indexOf('node_modules') !== -1;
}

module.exports = {
    context: __dirname + '/app/scripts.babel/',
    entry: {
        background: './background.js',
        options: './options.js',
        popup: './popup.js',
        zabbix: ['zabbix-promise'],
        crypto: ['sjcl', 'crypt.io']
    },
    output: { filename: '[name].js' },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        },{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },{
            test: /\.(jpe?g|png|gif|svg|eot|woff|ttf|svg|woff2)$/,
            loader: "file-loader?name=fonts/[name].[ext]"
        }]
    },
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['zabbix', 'crypto'],
            filename: '[name].js',
            minChunks: function(module, count) {
                return !isExternal(module) && count >= 2;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['common'],
            filename: '[name].js',
            minChunks: function(module) {
                return isExternal(module);
            }
        })
    ]
}
