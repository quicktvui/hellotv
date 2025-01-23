
## 快速开始

### 替换数据

  1. 可直接替换 目录api > search > mock 数据展示页面 （对应BuildConfig中useMockData为true 使用mock数据）
  2. 可直接替换为自己接口 目录api > GlobalApiImpl.ts 如下搜索相关接口修改 （对应BuildConfig中useMockData为false）

    ```js

    // 搜索中间列表 接口
    getHotSearch(pageNum: number,keyword?: string): Promise<Array<QTListViewItem>> 
    // 搜索结果tablist 接口
    getSearchResultTabList(): Promise<Array<QTTabItem>>
    // 搜索结果 接口
    getSearchResultPageData(pageNo: number, pageSize: number, keyword: string, title?: string): Promise<QTTabPageData>
     
    ```

    注意：当替换为自己请求接口时 具体字段可参照目录 search > build_data > useSearchData.ts 对应字段修改

### 搜索视图流程介绍

1. 初始化搜索左侧键盘组件
2. 调用`getHotSearch`获取列表数据，初始化搜索中间列表  
3. 初次使用搜索列表第一个值调用`getSearchResultTabList``getSearchResultPageData`获取搜索结果页面相关数据



## search接口请求模块
```bash

api 项目整体接口请求处理部分
│  
├─search 搜索视图模块
│  ├─mock 全局组件
│  │  ├─search_center_list 搜索中间列表模块 mock数据
│  │  ├─search_result_page_data 搜索结果列表  mock数据
│  │  └─search_result_tab_list 搜索结果tabs mock数据
│  │
│  ├─ISearchDataSource 定义（interface）搜索实现请求接口 3个
│  │
│  ├─GlobalApiImpl（实现ISearchDataSource 三个接口 getHotSearch getSearchResultTabList getSearchResultPageData）

```


## search功能目录结构
```bash

pages 视图模块
│  
├─search 搜索视图模块
│  ├─build_data 
│  │  └─useSearchData.ts 构建数据api  releated目录api search模块使用
│  │
│  ├─component 搜索子组件
│  │  ├─search-center 搜索中间热搜或者记录列表模块
│  │  ├─search-keyboard 搜索左侧键盘模块
│  │  ├─search-result-long-item 搜索结果自定义长视频item模块 该项目中未展示
│  │  └─search-result 搜索右侧结果展示模块
│  │
│  ├─css 搜索样式表
│  │  ├─search-center
│  │  ├─search-keyboard
│  │  ├─search-result
│  │  └─search
│  │
│  ├─index  search主页面视图
│  │
│  └─README 文档介绍

```




## search 代码阅读入口

```js

  // index.vue onESCreate 生命周期 中初始化左侧键盘 初始化中间列表
  const onESCreate = (params) => {
    search_keyboard.value!.initComponent()
    search_center.value!.initComponent()
  } 
 
  // search-result watch监听输入值变化刷新结果页的tabs 随后在qt-tabs onTabPageLoadData回调中处理item数据
  watch(() => props.keyword, (newVal, oldVal) => {
    if (newVal) {
      if (delaySearchByKeyword) clearTimeout(delaySearchByKeyword)
      isLoading.value = true
      descendantFocusability.value = 2 //屏蔽右侧获取焦点
      delaySearchByKeyword = setTimeout(() => {
        initTab()
        if (closeLoadingTimer) clearTimeout(closeLoadingTimer)
        isLoading.value = false
        closeLoadingTimer = setTimeout(() => {
          descendantFocusability.value = 1 //内容加载完毕 右侧获取焦点
        }, 1000)
      }, 600)
    }
  })

```
