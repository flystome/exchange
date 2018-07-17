'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var SpritesmithPlugin = require('webpack-spritesmith')
const HappyPack = require('happypack');
var vueLoaderConfig = require('./vue-loader.conf')
const os = require('os')
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length})
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const env = require('../config/dev.env')

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    headers: {
    },
    hot: true,
    contentBase: __dirname + '/', // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: path.resolve('./favicon.ico')
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*', 'img/sprites']
      }
    ]),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerHost: '0.0.0.0',
      analyzerPort: process.env.analyzerPort
    }),
    new SpritesmithPlugin({
      src: {
          cwd: path.resolve(__dirname, '../static/img/sprites'),
          glob: '*.png'
      },
      target: {
          image: path.resolve(__dirname, '../src/common/img/sprite.png'),
          css: path.resolve(__dirname, '../src/common/css/sprite.scss')
      },
      apiOptions: {
          cssImageRef: "~@/common/img/sprite.png"
      }
  }),
  new HappyPack({
    // 3) re-add the loaders you replaced above in #1:
    id: 'js',
    threadPool: HappyThreadPool,
    loaders: ['babel-loader']
  }),
  new HappyPack({
    id: 'vue',
    threadPool: HappyThreadPool,
    loaders: [
      {
        loader: 'vue-loader',
        options: vueLoaderConfig
      }
    ]
  }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
