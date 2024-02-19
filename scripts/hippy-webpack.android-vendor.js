const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const {VueLoaderPlugin} = require('vue-loader');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const platform = 'android';

module.exports = {
  mode: 'production',
  bail: true,
  entry: {
    vendor: [path.resolve(__dirname, './vendor.js')],
  },
  optimization: {
    moduleIds: 'named',
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  output: {
    filename: `[name].${platform}.js`,
    path: path.resolve(`./dist/${platform}/`),
    globalObject: '(0, eval)("this")',
    library: 'hippyVueBase',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __PLATFORM__: JSON.stringify(platform),
      __DEV__: false,
      __TEST__: false,
      __FEATURE_PROD_DEVTOOLS__: false,
      __BROWSER__: false,
      'process.env': '{}',
    }),
    new CaseSensitivePathsPlugin(),
    new VueLoaderPlugin(),
    new webpack.DllPlugin({
      context: path.resolve(__dirname, '..'),
      path: path.resolve(__dirname, `../dist/${platform}/[name]-manifest.json`),
      name: 'hippyVueBase',
    }),
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
        test: /\.(js)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
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
              ],
            },
          },
        ],
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
    //   //@extscreen/es3-vue
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
