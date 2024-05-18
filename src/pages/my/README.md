## 我的/个人中心 - 技术方案
## 功能
- 多模式加载
  - 支持路由模式
  - 支持组件模式
- 自定义瀑布流布局
  - 开发多个通用的海报模板
  - 开发账号管理海报组件
    - 登陆状态
    - 未登陆状态
  - 开发历史记录板块
    - 登陆状态
    - 未登陆状态
- 支持单独更新账号管理板块数据
- 支持单独更新历史记录板块数据
- 根据登陆状态更新页面数据
## 实现
- 目录结构
  - src/api/my/
    - types.ts 定义数据类型
    - base.ts  获取数据基类
    - index.ts 业务端需要实现的获取数据的方法，如：调api接口
    - configs.ts 页面配置文件
  - src/pages/my/
    - index.vue 路由页面
    - my-template.vue 模板组件
      - width 宽度
      - height 高度
    - poster/ 自定义海报模板，通过数据中的type值来确定使用哪个模板，默认提供三种通用海报
      - index.vue
      - info.vue
      - card.vue
```js
// 作为单独页面
const router = useESRouter()
router.push({
  name: '', params: {}
})
// 作为tab页使用，直接引用my-template.vue作为组件即可
import Mytemplate from 'src/pages/my/my-template.vue'
<Mytemplate />
```
- api
  - config.ts 文件中配置页面主题
    - bgColor 页面背景色
  - base.ts 文件中
    - initData    初始化页面数据，(页面创建时调用)
    - getConfig   获取页面配置信息
      - bgColor 页面背景色
    - getUserInfo 获取用户信息 - 第一个板块展示
    - getHistorys 获取历史记录信息
    - getMoreList 获取更多板块信息
- 板块数据格式示例
```js
[
  {
    _id: 'xxx',
    title: 'xxx',
    titleStyle: {
      width: 1000,
      height: 50,
      marginTop: 10,
      marginBottom: 10,
      fontSize: 50
    },
    itemList: [
      {
        _id: 'xxx',
        type: 1002,
        title: '',
        subTitle: '',
        img: '',
        icon: '',
        cornerNum: -1//大于-1时显示数字，否则显示红点
      }
    ]
  }
]
```