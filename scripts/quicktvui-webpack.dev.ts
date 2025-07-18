const path = require('path')
const webpack = require('webpack')
const ESDynamicImportPlugin = require('@extscreen/es3-dynamic-import-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const watchPlugin = require('./webpack-watch.ts')

const pkg = require('../package.json')
let cssLoader = "@extscreen/es3-vue-css-loader";

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  watch: true,
  watchOptions: {
    aggregateTimeout: 1500
  },
  devServer: {
    // remote debug server address
    remote: {
      protocol: 'http',
      host: '127.0.0.1',
      port: 38989
    },
    // support inspect vue components, store and router, by default is disabled
    vueDevtools: false,
    // support debug multiple project with only one debug server, by default is set false.
    multiple: false,
    // by default hot and liveReload option are true, you could set only liveReload to true
    // to use live reload
    hot: false,
    liveReload: false,
    client: {
      overlay: false
    },
    devMiddleware: {
      writeToDisk: true
    }
  },
  entry: {
    index: ['@hippy/rejection-tracking-polyfill', path.resolve(pkg.main)]
  },
  output: {
    filename: 'index.bundle',
    // chunkFilename: '[name].[chunkhash].js',
    strictModuleExceptionHandling: true,
    path: path.resolve('./dist/dev/'),
    globalObject: '(0, eval)("this")',
    assetModuleFilename: '[hash][ext][query]'
  },
  plugins: [
    new VueLoaderPlugin(),
    new watchPlugin({}),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        HOST: JSON.stringify(process.env.DEV_HOST || '127.0.0.1'),
        PORT: JSON.stringify(process.env.DEV_PORT || 38989)
      },
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __PLATFORM__: null,
      __DEV__: true
    }),
    new ESDynamicImportPlugin(),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                // disable vue3 dom patch flag，because hippy do not support innerHTML
                hoistStatic: false,
                // whitespace handler, default is 'condense', it can be set 'preserve'
                whitespace: 'condense'
              }
            }
          }
        ]
      },
      {
        test:/\.(sc|c)ss$/,
        use: [
          cssLoader,
          {
            loader: 'sass-loader',
            options: {
              additionalData:`@use './src/config/public-config.scss' as *;`,
            }
          }
        ]
      },
      {
        test: /\.t|js$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              target: 'es2015'
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          outputPath: 'assets/',
          publicPath: 'assets/'
        }
      },
      {
        test: /\.(ts)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    alias: (() => {
      const aliases = {
        src: path.resolve('./src'),
        quicktvui: path.resolve('../dist/quicktvui')
      }
      return aliases
    })()
  }
}
