var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
    entry: ['./src/app.js', './src/auth.js', './src/utils.js'],
    output: {
        path: './bin',
        publicPath: "assets/",
	    filename: PROD ? 'app.min.bundle.js' : 'app.bundle.js'
    },
    module: {
	    loaders: [
	        //{test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery'},
	        {test: /\.vue$/, loader: 'vue' },
    	    {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
    	    {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
    	    {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
    	    {test: /\.css$/, loader: 'style-loader!css-loader'},
    	    {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
    	    {test: /(.*)\.(png|jpeg|jpg|gif)$/, loader: 'url-loader?limit=8192'},
    	    {test: /\.json$/, loader: 'json-loader'},
    	    {test: /.js$/, exclude: /node_modules/, loader : 'babel'}
	    ]
    },
    vue: {
      loaders: {
        scss: 'style!css!sass'
      }
    },
    babel: {
        presets: ['es2015','es2017'],
        plugins: ['transform-runtime']
    },

    devServer: {
        hot: true,
        proxy: {
            '/api/**': {
                target: 'http://127.0.0.1:8080',
                secure: false,
                changeOrigin: true,
                pathRewrite: {'^/api': ''}
            }
        },
        plugins: PROD ? [
            new webpack.optimize.UglifyJsPlugin({
                compress: {warnings: false}
            })
        ] : []
    }
}