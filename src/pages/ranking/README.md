## 页面-ui层
- src/pages/ranking/index.vue
  - 入口文件/主页面
  - 控制全局样式
  - 页面下面布局两个组件：
  - src/pages/ranking/RankTop.vue
    - 顶栏组件
  - src/pages/ranking/RankTab.vue
    - tab组件-使用tabs/waterfall布局
    - src/pages/ranking/RankTabContent
      - 内容组件，内嵌各种自定义板块布局
      - 支持嵌入到RankTab中，也支持嵌入到其他页面(如：首页)的tab/waterfall组件中
- src/pages/ranking/index.ts
  - 数据处理-提供将接口数据转换为页面需要的格式数据
  - 对外抛出节目管理类对象rankManager，提供操作页面的api
    - init() 初始化界面数据
    - updateXXX() 更新某个板块/格子数据，内部使用sid更新界面
## 数据接口层
- src/api/ranking/base.ts
  - 接口基础类-定义获取数据方法/参数/回调函数的返回结果类型
  - init(routeParams) 初始化函数
  - getConfig() 异步返回配置信息
    - bgColor 背景色
    - tab 顶栏信息，返回null则不展示顶栏
    - videoLayoutMode 视频和媒咨布局格式，视频在左/在右
  - getVideoInfo() 返回视频数据
  - getMoreList() 返回更多相关视频信息
  - ...
- src/api/ranking/index.ts
  - 数据业务处理-继承并实现base类，调用后台接口返回数据
- src/api/ranking/types.ts
  - 类型定义-所有需要用到的数据类型/接口，都在这个文件中定义

<!-- 
ls:todo
- 初始化焦点定位到指定视频/图片上
 -->