## 页面-ui层
- src/pages/detail2/index.vue
  - 入口文件/主页面
  - 控制全局样式
  - 页面下面分五大组件：
    - src/pages/detail2/D2Top.vue
      - 顶部栏组件
    - src/pages/detail2/D2Selections
      - 选集列表组件
    - src/pages/detail2/D2DesDrawer.vue
      - 抽屉信息展示组件
    - src/pages/detail2/D2Info.vue
      - 视频详情介绍组件
    - src/pages/detail2/D2Video.vue
      - 视频组件
  - 一个脚本文件：
    - src/pages/detail2/index.ts
      - 数据处理-提供将接口数据转换为页面需要的格式数据
      - 作为中心仓库-处理五大组件跨层级通信问题，例：
        - init() 初始化参数，拿到五大组件的ref
        - xxxVideo() 处理操作视频的函数
        - xxxDrawer() 处理操作抽屉弹框的函数
        - xxx
## 数据接口层
- src/api/details2/base.ts
  - 接口基础类-定义获取数据方法/参数/回调函数的返回结果类型
  - init(routeParams) 初始化函数
  - getConfig() 异步返回配置信息
    - bgColor 背景色
    - tab 顶栏信息，返回null则不展示顶栏
    - tabMode 顶栏展示模式：log在左/在右
  - getVideoInfo() 返回视频数据
  - getRecommend() 返回推荐数据
  - ...
- src/api/details2/index.ts
  - 数据业务处理-继承并实现base类，调用后台接口返回数据
- src/api/details2/types.ts
  - 类型定义-所有需要用到的数据类型/接口，都在这个文件中定义

<!-- 
ls:todo
- 花絮列表选择状态显示
- play-mark动图
- 向下按钮定位到当前播放视频的选集上
- 小窗播放
b站逻辑
- 标题显示专辑名称
- 标签显示：平分、分类、总集数/更新至第几集

- 接口
  - 媒资集合中没有视频简介信息，是否每切换一个视频就要重新拉接口？
  - 没有系列、花絮等数据
  - 只有一个推荐列表数据，没有相关剧情、更多剧情等数据
    - 推荐列表中没有日期信息，是否不显示日期
  - videoIds 和 medias的区别，哪个是选集列表
  - 没有排行榜的信息，(如: 属于哪个类别的排行榜，排第几名)
  - 没有 喜剧、动作、犯罪等标签/分类信息，只有分类type是数字不知是啥意思
  - 没有搜索框提示内容数据
  - 没有上次播放记录数据，如：上次播放到了第几集

  - 没有排行榜相关接口
  - 没有添加追剧/收藏接口
  - 没有添加历史接口
 -->