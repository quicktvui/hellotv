const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const watchPlugin = require('./webpack-watch.js');
const HippyDynamicImportPlugin = require('@hippy/hippy-dynamic-import-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');

const pkg = require('../package.json');
let cssLoader = '@hippy/vue-css-loader';
const hippyVueCssLoaderPath = path.resolve(__dirname, '../../../packages/hippy-vue-css-loader/dist/css-loader.js');
if (fs.existsSync(hippyVueCssLoaderPath)) {
  console.warn(`* Using the @hippy/vue-css-loader in ${hippyVueCssLoaderPath}`);
  cssLoader = hippyVueCssLoaderPath;
} else {
  console.warn('* Using the @hippy/vue-css-loader defined in package.json');
}

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  watch: true,
  watchOptions: {
    aggregateTimeout: 1500,
  },
  devServer: {
    // remote debug server address
    remote: {
      protocol: 'http',
      host: '127.0.0.1',
      port: 38989,
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
      overlay: false,
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  entry: {
    index: ['@hippy/rejection-tracking-polyfill', path.resolve(pkg.nativeMain)],
  },
  output: {
    filename: 'index.bundle',
    // chunkFilename: '[name].[chunkhash].js',
    strictModuleExceptionHandling: true,
    path: path.resolve('./dist/dev/'),
    globalObject: '(0, eval)("this")',
  },
  plugins: [
    new VueLoaderPlugin(),
    new watchPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        ...require('./env-config.js'),
        NODE_ENV: JSON.stringify('development'),
        HOST: JSON.stringify(process.env.DEV_HOST || '127.0.0.1'),
        PORT: JSON.stringify(process.env.DEV_PORT || 38989),
      },
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __PLATFORM__: null,
      __DEV__: true,
    }),
    new HippyDynamicImportPlugin(),
    // LimitChunkCountPlugin can control dynamic import ability
    // Using 1 will prevent any additional chunks from being added
    // new webpack.optimize.LimitChunkCountPlugin({
    //   maxChunks: 1,
    // }),
    // use SourceMapDevToolPlugin can generate sourcemap file while setting devtool to false
    // new webpack.SourceMapDevToolPlugin({
    //   test: /\.(js|jsbundle|css|bundle)($|\?)/i,
    //   filename: '[file].map',
    // }),
    new CleanWebpackPlugin(),
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
                whitespace: 'condense',
              },
            },
          },
        ],
      },
      {
        test: /\.(le|c)ss$/,
        use: [cssLoader, 'less-loader'],
      },
      {
        test: /\.t|js$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              target: 'es2015',
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: true,
            // limit: 8192,
            // fallback: 'file-loader',
            // name: '[name].[ext]',
            // outputPath: 'assets/',
          },
        }],
      },
      {
        test: /\.(ts)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    alias: (() => {
      const aliases = {
        src: path.resolve('./src'),
        // '@extscreen/es3-player-manager': path.resolve('./packages/ESPlayerManager'),
        // '@extscreen/es3-bilibili-player': path.resolve('./packages/ESBilibiliPlayer'),
        // vue: 'vue/dist/vue.esm-bundler.js'
        // '@extscreen/es3-router': path.resolve('./packages/ESRouter'),
        // '@extscreen/es3-core': path.resolve('./packages/ESCore'),
        // '@extscreen/es3-video-player': path.resolve('./packages/ESVideoPlayer/dist/es3-video-player.mjs')
      };
      return aliases;
    })(),
  },
};
