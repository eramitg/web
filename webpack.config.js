const webpack = require('webpack');
const path = require('path');
const PROD = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './bin'),
    publicPath: 'assets/',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'style-loader!css-loader!sass-loader',
            stylus: 'style-loader!css-loader!stylus-loader'
          }
        }
      },
      {test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules(?!\/(vue-tables-2|vue-pagination-2|vuex-i18n))/},
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(scss|sass)$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue',
      assets: 'assets/image'
    },
    extensions: [".webpack.js", ".web.js", ".js", ".vue"]
  },
  devServer: {
    noInfo: true,
    clientLogLevel: 'warning',
    proxy: {
      '/api/**': {
	      target: 'http://127.0.0.1:8080',
        secure: false,
        changeOrigin: true,
        pathRewrite: {'^/api': ''}
      }
    },
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: PROD,
      options: {
        context: path.resolve(__dirname, '../src'),
      }
    })
  ]
};

if(PROD){
  module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ])
}
