## 快速开始
### 替换数据
```ts
1. 实现src > api > GlobalApiImpl.ts中的3个数据接口

 a. getTabList() //获取瀑布流tab数据

 b. getTabContent(tabId: string, pageNo: number, pageSize: number) //获取对应tab内容

 c. getHomeBgVideoAssetsUrl(playDataItem:TabPlayItem) //单独获取播放URL（若原数据中已有，可不实现）

2. 转换数据 转换src > pages > home > build_data > useTabData.ts中以下2个方法

 a. buildO2MTabData(sourceData:Array<any>) //转换瀑布流Tab数据
    //注意：tab转换参照src > pages > home > build_data > tab > impl > Tab.ts对应的字段修改

 b. buildO2MTabContentData(sourceData:any,pageNo:number=1,tabId:string) //转换Tab Content 数据
    //注意：tabContent转换参照src > pages > home > build_data > tab_content > TabContent.ts对应字段修改

```
## home 相关接口请求模块
```bash
api 项目整体接口请求处理部分
│
├─home 首页接口模块
│  ├─mock mock数据
│  │  ├─home_tab.ts   tab mock数据
│  │  ├─home_page0.ts 第1个Tab对应的content数据---小窗播放数据
│  │  ├─home_page1.ts 第2个Tab对应的content数据---小窗列表播放数据
│  │  ├─home_page2.ts 第3个Tab对应的content数据---背景播放数据
│  │  ├─home_page3.ts 第3个Tab对应的content数据---普通数据
│  │  └─media_detail_1703598812798386177.ts 背景播放
│  └─IHomeDataSource.ts 定义（interface）首页瀑布流实现请求接口
├─GlobalApiImpl.ts  实现IHomeDataSource.ts 中三个接口(getTabList，getTabContent，getHomeBgVideoAssetsUrl)
```

## home 视图目录结构：
```bash
pages 视图模块
│
├─home 首页视图模块
│  ├─build_data
│  │  ├─tab
│  │  │  ├─impl tab数据定义
│  │  │  │  └─Tab.ts
│  │  │  ├─tab_type tab数据类型定义
│  │  │  │  └─TabType.ts
│  │  │  ├─TabAdapter.ts 
│  │  │  ├─tabs.ts 
│  │  │  └─TabTransferAdapter.ts
│  │  ├─tab_content
│  │  │  ├─impl tab content数据定义
│  │  │  │  ├─TabContent.ts
│  │  │  │  ├─TabContentPlate.ts
│  │  │  │  ├─TabContentSection.ts
│  │  │  │  ├─TabPlayItem.ts
│  │  │  │  └─TabSectionItem.ts
│  │  │  ├─tab_content_type tab content数据类型定义
│  │  │  │  ├─TabContentPlateType.ts
│  │  │  │  ├─TabSectionItemType.ts
│  │  │  │  └─TabSectionType.ts
│  │  │  ├─page.ts
│  │  │  ├─TabContentAdapter.ts
│  │  │  ├─TabContentItemAdapter.ts
│  │  │  ├─TabContentItemPosterAdapter.ts
│  │  │  └─TabContentTransferAdapter.ts
│  │  └─useTabData.ts 构建数据
│  ├─components 首页组件
│  │  ├─page 首页格子样式组件
│  │  │  ├─page-no-frame-item.vue 无边框格子
│  │  │  ├─page-place-holder-item.vue 占位格子
│  │  │  └─page-state-image-item.vue 焦点换图格子
│  │  ├─tab 首页tab样式组件
│  │  │  ├─tab-icon-item.vue  文字带角标组件
│  │  │  ├─tab-image-item.vue 图片tab 组件
│  │  │  └─tab-text-icon-item.vue 文字带icon和角标组件
│  │  ├─item-cell-player.vue 
│  │  ├─waterfall-background.vue 
│  │  └─waterfall-tabs.vue 瀑布流主要视图界面
│  ├─css 首页样式
│  │  └─home.css 首页样式
│  ├─index.vue 首页主页面
│  └─README.md 文档介绍
```
## home 代码阅读入口
```js
//index.vue onESCreate 生命周期 中初始化瀑布流tab数据
function onESCreate(params) {
 waterfallTabs.value?.onESCreate(params)
}
//waterfall-tabs.vue onESCreate中获取tab数据
function onESCreate(params) {
  getTabList()
  isOneTime = true
}
//waterfall-tabs.vue onTabPageLoadData 回调方法中获取当前tab对应的数据
function onTabPageLoadData(pageIndex: number, pageNo: number, useDiff: boolean): void {
  if (tabItemList && pageIndex >= 0 && pageIndex < tabItemList.length) {
    const tab = tabItemList[pageIndex]
    if(tab._id == '0' || tab._id) getTabContent(tab._id, pageIndex, pageNo + 1)
  }
}
```
