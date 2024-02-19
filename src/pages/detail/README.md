
## 快速开始

### 替换数据
`/src/api/media/IMedia*`为详情页面数据类型
`/src/api/media/impl/*`为详情页面数据类型具体实现。

`/src/api/media/impl/MediaDataSourceImpl.ts`为具体的接口调用实现。
`/src/api/media/impl/MediaMockDataSourceImpl`为具体的模拟数据实现。

  1. 可直接替换 目录api > media > impl > MediaMockDataSourceImpl.ts 数据展示页面 （对应BuildConfig中useMockData为true 使用mock数据）
  2. 可直接替换为自己接口 目录api > media > MediaDataSourceImpl.ts 如下详情页面相关接口修改 （对应BuildConfig中useMockData为false）
  3. 可直接继承`IMediaDataSource`实现接口。

```
    //详情页面数据
    getMediaDetail(mediaId: string): Promise<IMedia | null | undefined>
    //详情页面底部相关推荐
    getMediaRecommendation(mediaId: string): Promise<Array<IMedia>>
    //视频分集列表信息
    getMediaItemList(mediaItemListId: string, pageNo: number, pageSize: number): Promise<Array<IMedia>>
    //根据视频分集信息获取视频播放地址接口
    getMediaItemUrl(mediaItemId: string): Promise<Array<IMediaUrl>>
    //视频鉴权接口
    getMediaAuthorization(mediaId: string): Promise<IMediaAuthorization | null | undefined>
    //视频播放鉴权接口
    getMediaItemAuthorization(mediaItemId: string): Promise<IMediaAuthorization | null | undefined>
```

## detail功能目录结构
```

pages 视图模块
│  
├─detail 视频详情视图模块
│  ├─adapter 适配器
│  │  ├─DataAdapter.ts                  整体瀑布流数据适配器
│  │  ├─MediaSeriesAdapter.ts           选集列表数据适配器
│  │  └─PlayerDataAdapter.ts            视频播放器数据适配器
│  │
│  ├─component 模块和子组件
│  │  ├─media-introduction.vue          视频简介模块
│  │  ├─IMediaIntroduction.ts           视频简介模块接口
│  │  ├─media-list.vue                  选集列表模块
│  │  ├─IMediaListView.ts               选集列表模块接口
│  │  ├─media-menu.vue                  按钮菜单模块
│  │  ├─media-player.vue                视频播放模块
│  │  ├─IMediaPlayer.ts                 视频播放模块接口
│  │  ├─media-player-view.vue           视频播放视图模块
│  │  ├─media-menu-button.vue           按钮子组件
│  │  ├─media-menu-vip-button.vue       会员按钮子组件
│  │  ├─media-player-loading-view.vue   加载loading子组件
│  │  ├─IMediaLoadingView.ts            加载loading子组件接口
│  │  ├─media-player-placeholder.vue    视频焦点框子组件
│  │  ├─IMediaPlaceholder.ts            视频焦点框子组件接口
│  │  ├─media-player-small-view.vue     视频小窗口播放视图子组件
│  │  └─navigation-button.vue           页面顶部导航按钮子组件
│  │
│  ├─player 播放相关
│  │  └─ESPlayerMediaItemInterceptor.ts 播放鉴权拦截器
│  │
│  ├─section 瀑布流板块 
│  │  ├─album-detail-section.vue        播放相关板块
│  │  ├─IAlbumDetail.ts                 播放相关板块接口
│  │  └─header-section.vue              顶部导航板块
│  │
│  ├─index.vue                          视频详情主页面视图
│  │
│  └─README                             文档介绍

```


## 视频详情视图的流程介绍

1. 调用`getMediaDetail`方法获取详情数据
2. 初始化详情页面瀑布流           
   1)初始化简介和菜单       
   2)初始化视频选集列表          
   3)视频选集列表回调事件触发获取视频分集     
   4)组装获取到的视频分集信息初始化视频播放管理器         
   5)视频播放管理器执行视频鉴权逻辑并进行播放       
3. 执行鉴权逻辑并获取相关推荐数据
