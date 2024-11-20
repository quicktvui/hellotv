import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import checkFile from 'eslint-plugin-check-file';


/** @type {import('eslint').Linter.Config[]} */
export default [

  { files: ['**/*.{js,ts,vue}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tsEslint.parser } } },
  {
    ignores: [
      '**/shims-vue.d.ts',
      '**/app.d.ts',
      'scripts/**',
      'dist/**',
      'android/**',
      'build/**',
      'dist/**',
      'doc/**',
      'node_modules/**',
      '!(*.*)',
      '**.md',
      'src/vue.config.js',
      'vue.config.js',
      'eslint.config.mjs'
    ]
  },
  // eslint 规则 https://eslint.nodejs.cn/docs/latest/rules/
  // typescript-eslint 规则 https://typescript-eslint.io/rules/
  // vue 规则 https://eslint.vuejs.org/rules/
  {
    plugins:{'check-file':checkFile},
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn', // 允许使用 console
      'check-file/no-index':'off',
      'check-file/filename-naming-convention': [
        'warn',
        { 'src/*/**/*.{js,ts,vue,scss}': 'KEBAB_CASE' }
      ],
      'check-file/folder-naming-convention': [
        'warn',  { 'src/**/': 'KEBAB_CASE'}
      ],
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
      '@typescript-eslint/no-unused-vars': ['error',{
        //忽略生命周期中的方法检测
        "varsIgnorePattern": "^(onESCreate|onESStart|onESRestart|onESResume|onESPause|onESStop|onESDestroy|onBackPressed|onKeyDown|onKeyUp)$",
      }], // 允许使用 any 类型
      'vue/multi-word-component-names': ['error', { 'ignores': ['index'] }],//打开 Vue 组件名称多词规则
      'vue/component-name-in-template-casing': ['error', 'kebab-case', {
        'registeredComponentsOnly': true
        // "ignores": []
      }], //注册组件名称引用要kebab-case 短横线+小写
      'vue/no-dupe-keys': ['error', { 'groups': [] }],//禁止props/ data/ methods/ 等使用重复名称
      'vue/attribute-hyphenation': ['error', 'always', { 'ignore': [] }],//自定义组件上使用带连字符的属性名称
      'vue/max-attributes-per-line': ['error', { 'singleline': 5, 'multiline': 5 }],//每行允许写5个属性
      'vue/html-quotes': ['off', 'single', { 'avoidEscape': true }], //关闭单双引号限制，根据prettierrc规则控制
      "vue/match-component-file-name": ["off", { "extensions": ["jsx"], "shouldMatchCase": false }],
      "vue/match-component-import-name":'off',
    }
  }
]