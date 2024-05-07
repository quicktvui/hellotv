const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const watchPlugin = require('./webpack_watch.js');
const HippyDynamicImportPlugin = require('@hippy/hippy-dynamic-import-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');

const pkg = require('../package.json');
let cssLoader = '@hippy/vue-css-loader';

/**override flavor*/
const { execSync } = require('child_process');
const { getFlavorDir } = require('./libs/flavorUtil');
const { getFlavor } = require('../scripts/libs/flavorUtil');
//默认 quicktvui-template-config
let flavorName = process.env.flavor ? process.env.flavor : "quicktvui-template-config"
console.log(`>>>>>>>buildFlavor flavorName : ${flavorName}\n`)
let flavorDir = getFlavorDir('./build/flavor',flavorName)
const flavor = getFlavor('./build/flavor',flavorName)
console.log(`>>>>>>>buildFlavor flavor : ${JSON.stringify(flavor)}\n`)
let flavorPath = path.resolve(flavorDir,'./config.json')
console.log(`start dev flavorName : ${flavorName},\n path:${flavorPath},\n flavorDir:${flavorDir}\n`)

let os = process.platform
console.log(`os ：`+os)
if(os && os .startsWith('win')){
  //不支持windows
  console.log(`注意！当前操作系统不支持替换src os ：`+os)
}else{
  try{
    let sourceSrc = path.resolve(flavorDir,'./src')
    let destSrc = path.resolve(flavorDir,'../../../')
    console.log(`sourceSrc:${sourceSrc} ,destSrc path is:${destSrc}`)
    fs.statSync(sourceSrc)
    execSync(`cp -r ${path.resolve(flavorDir,'./src')} ${destSrc}`)
  }catch (e){console.log('replace src error:'+e)}
}


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
    hot: true,
    liveReload: true,
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
      // __CONFIG__:JSON.stringify(flavor),
      __THEME__:JSON.stringify(flavor.theme),
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
        // '@': path.resolve('./src'),
      };

      // If @vue/runtime-core was built exist in packages directory then make an alias
      // Remove the section if you don't use it
      const hippyVueRuntimeCorePath = path.resolve(__dirname, '../node_modules/@vue/runtime-core');
      if (fs.existsSync(path.resolve(hippyVueRuntimeCorePath, 'index.js'))) {
        console.warn(`* Using the @vue/runtime-core in ${hippyVueRuntimeCorePath} as vue alias`);
        aliases['@vue/runtime-core'] = hippyVueRuntimeCorePath;
      } else {
        console.warn('* Using the @vue/runtime-core defined in package.json');
      }

      // If @hippy/vue-next was built exist in packages directory then make an alias
      // Remove the section if you don't use it
      const hippyVueNextPath = path.resolve(__dirname, '../node_modules/@extscreen/es3-vue');
      if (fs.existsSync(path.resolve(hippyVueNextPath, 'index.ts'))) {
        console.warn(`* Using the @extscreen/es3-vue in ${hippyVueNextPath} as @extscreen/es3-vue alias`);
        aliases['@extscreen/es3-vue'] = hippyVueNextPath;
      } else {
        console.warn('* Using the @extscreen/es3-vue defined in package.json');
      }
      return aliases;
    })(),
  },
};
