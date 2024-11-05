const path = require('path');
const fs = require('fs');
const HippyDynamicImportPlugin = require('@hippy/hippy-dynamic-import-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

const platform = 'android';
const pkg = require('../package.json');
const manifest = require('../dist/android/vendor-manifest.json');
let cssLoader = '@hippy/vue-css-loader';

/**override flavor*/
// const { execSync } = require('child_process');
// const { getFlavorDir } = require('./libs/flavorUtil');
// const { getFlavor } = require('../scripts/libs/flavorUtil');
//默认 quicktvui-template-config
// let flavorName = process.env.flavor ? process.env.flavor : "quicktvui-template-config"
// console.log(`>>>>>>>buildFlavor flavorName : ${flavorName}\n`)
// let flavorDir = getFlavorDir('./build/flavor', flavorName)
// const flavor = getFlavor('./build/flavor', flavorName)
// console.log(`>>>>>>>buildFlavor flavor : ${JSON.stringify(flavor)}\n`)
// let flavorPath = path.resolve(flavorDir, './config.json')
// console.log(`start dev flavorName : ${flavorName},\n path:${flavorPath},\n flavorDir:${flavorDir}\n`)
// let os = process.platform
// console.log(`os ：` + os)
// if (os && os.startsWith('win')) {
//   //不支持windows
//   console.log(`注意！当前操作系统不支持替换src os ：` + os)
// } else {
//   try {
//     let sourceSrc = path.resolve(flavorDir, './src')
//     let destSrc = path.resolve(flavorDir, '../../../')
//     console.log(`sourceSrc:${sourceSrc} ,destSrc path is:${destSrc}`)
//     fs.statSync(sourceSrc)
//     execSync(`cp -r ${path.resolve(flavorDir, './src')} ${destSrc}`)
//   } catch (e) { console.log('replace src error:' + e) }
// }

const hippyVueCssLoaderPath = path.resolve(__dirname, '../../../packages/hippy-vue-css-loader/dist/css-loader.js');
if (fs.existsSync(hippyVueCssLoaderPath)) {
  console.warn(`* Using the @hippy/vue-css-loader in ${hippyVueCssLoaderPath}`);
  cssLoader = hippyVueCssLoaderPath;
} else {
  console.warn('* Using the @hippy/vue-css-loader defined in package.json');
}

module.exports = {
  mode: 'production',
  bail: true,
  entry: {
    index: [path.resolve(pkg.nativeMain)],
  },
  output: {
    filename: `[name].${platform}.js`,
    path: path.resolve(`./dist/${platform}/`),
    strictModuleExceptionHandling: true,
    globalObject: '(0, eval)("this")',
    // CDN path can be configured to load children bundles from remote server
    // publicPath: 'https://xxx/hippy/hippyVueNextDemo/',
  },
  optimization: {
    moduleIds: 'named',
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        ...require('./env-config.js'),
        NODE_ENV: JSON.stringify('production'),
      },
      __PLATFORM__: JSON.stringify(platform),
      __DEV__: false,
      __TEST__: false,
      __FEATURE_PROD_DEVTOOLS__: false,
      __BROWSER__: false,
      // __THEME__: JSON.stringify(flavor.theme),
    }),
    new CaseSensitivePathsPlugin(),
    new VueLoaderPlugin(),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '..'),
      manifest,
    }),
    new HippyDynamicImportPlugin(),
    // LimitChunkCountPlugin can control dynamic import ability
    // Using 1 will prevent any additional chunks from being added
    // new webpack.optimize.LimitChunkCountPlugin({
    //   maxChunks: 1,
    // }),
    // use SourceMapDevToolPlugin can generate sourcemap file
    // new webpack.SourceMapDevToolPlugin({
    //   test: /\.(js|jsbundle|css|bundle)($|\?)/i,
    //   filename: '[file].map',
    // }),
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
        test:/\.scss$/,
        use:[
          cssLoader,
          'sass-loader',
          {
            loader:'sass-loader',
            options:{
              additionalData:`@import './src/build/public.scss';`
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
                      chrome: 57,
                    },
                  },
                ],
              ],
              plugins: [
                ['@babel/plugin-proposal-class-properties'],
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-transform-runtime', { regenerator: true }],
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            // if you would like to use base64 for picture, uncomment limit: true
            // limit: true,
            // limit: 8192,
            fallback: 'file-loader',
            name: '[name].[ext]',
            outputPath: 'assets/',
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
    // modules: [path.resolve(__dirname, '../node_modules')],
    // alias: (() => {
    //   const aliases = {
    //     src: path.resolve('./src'),
    //   };
    //
    //   //@vue/runtime-core
    //   // const hippyVueRuntimeCorePath = path.resolve(__dirname, '../node_modules/@vue/runtime-core');
    //   // if (fs.existsSync(path.resolve(hippyVueRuntimeCorePath, 'index.ts'))) {
    //   //   console.warn(`* Using the @vue/runtime-core in ${hippyVueRuntimeCorePath} as vue alias`);
    //   //   aliases['@vue/runtime-core'] = hippyVueRuntimeCorePath;
    //   // } else {
    //   //   console.warn('* Using the @vue/runtime-core defined in package.json');
    //   // }
    //
    //   // //@extscreen/es3-vue
    //   // const hippyVueNextPath = path.resolve(__dirname, '../node_modules/@extscreen/es3-vue');
    //   // if (fs.existsSync(path.resolve(hippyVueNextPath, 'index.ts'))) {
    //   //   console.warn(`* Using the @extscreen/es3-vue in ${hippyVueNextPath} as @extscreen/es3-vue alias`);
    //   //   aliases['@extscreen/es3-vue'] = hippyVueNextPath;
    //   // } else {
    //   //   console.warn('* Using the @extscreen/es3-vue defined in package.json');
    //   // }
    //
    //   //
    //   // const componentPath = path.resolve(__dirname, '../node_modules/@extscreen/es3-component');
    //   // if (fs.existsSync(path.resolve(componentPath, 'index.ts'))) {
    //   //   console.warn(`* Using the @extscreen/es3-component in ${componentPath} as @extscreen/es3-component alias`);
    //   //   aliases['@extscreen/es3-component'] = componentPath;
    //   // } else {
    //   //   console.warn('* Using the @extscreen/es3-component defined in package.json');
    //   // }
    //   //
    //   // const routerPath = path.resolve(__dirname, '../node_modules/@extscreen/es3-router');
    //   // if (fs.existsSync(path.resolve(routerPath, 'index.ts'))) {
    //   //   console.warn(`* Using the @extscreen/es3-router in ${routerPath} as @extscreen/es3-router alias`);
    //   //   aliases['@extscreen/es3-router'] = routerPath;
    //   // } else {
    //   //   console.warn('* Using the @extscreen/es3-router defined in package.json');
    //   // }
    //   //
    //   // const styleParserPath = path.resolve(__dirname, '../node_modules/@extscreen/es3-vue-style-parser');
    //   // if (fs.existsSync(path.resolve(styleParserPath, 'index.ts'))) {
    //   //   console.warn(`* Using the @extscreen/es3-vue-style-parser in ${styleParserPath} as @extscreen/es3-vue-style-parser alias`);
    //   //   aliases['@extscreen/es3-vue-style-parser'] = styleParserPath;
    //   // } else {
    //   //   console.warn('* Using the @extscreen/es3-vue-style-parser defined in package.json');
    //   // }
    //
    //   return aliases;
    // })(),
  },
};
