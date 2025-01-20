const path = require('path')
const ESDynamicImportPlugin = require('@extscreen/es3-dynamic-import-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackObfuscator = require('webpack-obfuscator')
const platform = 'android'
const pkg = require('../package.json')
let cssLoader = '@hippy/vue-css-loader'

module.exports = {
  mode: 'production',
  bail: true,
  entry: {
    index: [path.resolve(pkg.main)]
  },
  output: {
    filename: `[name].${platform}.js`,
    path: path.resolve(`./dist/${platform}/`),
    strictModuleExceptionHandling: true,
    globalObject: '(0, eval)("this")',
    assetModuleFilename: '[hash][ext][query]',
    // CDN path can be configured to load children bundles from remote server
    // publicPath: 'https://xxx/hippy/hippyVueNextDemo/',
    publicPath: './'
  },
  optimization: {
    moduleIds: 'named',
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          output: {
            // 是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，可以设置为false
            beautify: false,
            // 是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
            comments: false
          },
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true,
            pure_funcs: ['console.log']
          }
        },
        extractComments: false
      })
    ],
    splitChunks: {
      chunks: 'initial',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          filename: 'vendor.android.js'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __PLATFORM__: JSON.stringify(platform),
      __DEV__: false,
      __TEST__: false,
      __FEATURE_PROD_DEVTOOLS__: false,
      __BROWSER__: false,
      'process.env': '{}'
    }),
    new CaseSensitivePathsPlugin(),
    new VueLoaderPlugin(),
    new ESDynamicImportPlugin(),
    new WebpackObfuscator(
      {
        rotateStringArray: true
      },
      ['']
    )
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
              additionalData:`@use 'src/config/public-config.scss' as *;`,
            }
          }
        ]
      },
      {
        test: /\.t|js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              sourceType: 'unambiguous',
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      chrome: 57
                    }
                  }
                ]
              ],
              plugins: [
                ['@babel/plugin-proposal-class-properties'],
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-transform-runtime', { regenerator: true }]
              ]
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
      }
      return aliases
    })()
  }
}
