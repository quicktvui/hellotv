## 快速开始
### 替换数据
```ts
1. 实现src > api > GlobalApiImpl.ts中的2个数据接口

 a. getScreenLeftTags(screenId:string) //获取左侧筛选列表

 b. getScreenContentByTags(tags,pageNum) //获取筛选结果

2. 转换数据 转换src > pages > filter > build_data > useTabData.ts中以下2个方法

 a.buildTagsData(tags:any,defaultSelectTag?:string,defaultFilters?:Array<string>,defaultFastTag?:string) //转换筛选左侧列表数据
   //注意：转换参照src > pages > filter > build_data  > impl > Tag.ts对应的字段修改

 b.buildFiltersCondition(filterList:Array<any>,defaultFilter?:Array<string>,defaultFastTag?:string)//转换筛选条件列表
  //注意：转换参照src > pages > filter > build_data  > impl > FilterConditionList.ts,FilterCondition.ts对应的字段修改

 c.buildScreenContent(tagContents:Array<any>,pageNum?:number) // 转换筛选结果数据
 //注意：转换参照src > pages > filter > build_data  > impl > TagContent.ts对应的字段修改
```
## filter 相关接口请求模块
```bash
api 项目整体接口请求处理部分
│
├─filter 筛选接口模块
│  └─IScreenDataSource.ts 定义（interface）筛选请求接口
├─GlobalApiImpl.ts  IScreenDataSource.ts 中二个接口(getScreenLeftTags，getScreenContentByTags)
```
## filter 视图目录结构：
```bash
pages 视图模块
│
├─filter 筛选视图模块
|   ├─build_data
|   |     ├─useTagsData.ts 构建数据
|   |     ├─tags
|   |     |  └─TagsAdapter.ts
|   |     ├─impl 数据定义
|   |     |  ├─FilterCondition.ts
|   |     |  ├─FilterConditionList.ts
|   |     |  ├─TagContent.ts
|   |     |  └─Tags.ts
|   ├─components 筛选组件
|   |     ├─tags-content-item.vue 右侧列表筛选结果Item组件
|   |     ├─tags-content.vue 右侧列表界面
|   |     ├─tags-filter-fast-item-left-tip.vue 快速筛选标签 tip组件
|   |     ├─tags-filter-fast-item.vue 快速筛选标签 Item 组件
|   |     ├─tags-filter-fast-line.vue 快速筛选标签line 组件
|   |     ├─tags-filter-item.vue 筛选标签 Item 组件
|   |     ├─tags-filter-record.vue 筛选标签历史记录Item组件
|   |     ├─tags-img-item.vue 左侧列表图片组件
|   |     ├─tags-text-icon-item.vue 左侧列表文字带 Icon组件
|   |     └─tags-text-item.vue 左侧列表纯文字组件
|   ├─css 样式文件
|   |  ├─right-filter.css 
|   |  ├─screen.css 
|   |  ├─tag-right-content-item.css
|   |  ├─tags-left-item.css
|   |  └─tags-right-content.css
|   ├─index.vue 筛选主界面
|   └─README.md 文档介绍
```
## 筛选 代码阅读入口
```js
//index.vue onESCreate 生命周期 中获取筛选参数
function onESCreate(params) {
    //获取参数
    ...
    //获取筛选数据
    getTagsData()
}
参数释义：
params.screenId: //当前接口筛选 ID
params.defaultSelectTag：//默认选中左侧筛选列表tag 最优先展示 eg:"科普" 注意：同时只能选中一个
params.defaultFilters: //默认选中的筛选条件 eg:"少儿,2021,方块熊" 注意：可以选中 N 个
params.defaultFastTag: //默认选中的快速筛选标签 eg:"早教" 注意：只能选中一个
```
