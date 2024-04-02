## 网络数据接入准备工作
1. 在[BuildConfig.ts](./src/build/BuildConfig.ts) 中设置useMockData 为 false 使用网络数据，设置true 使用mock数据
2. 在[BuildConfig.ts](./src/build/BuildConfig.ts) 中设置数据请求域名requestBaseUrl
3. 在[RequestUrl.ts](./src/api/RequestUrl.ts) 中设置请求地址
4. 在[RequestManager.ts](./src/api/request/RequestManager.ts) 中的init中初始化公共请求体，post/get方法中解析封装原始数据

## Project整体目录结构
```bash
src
├─App.vue 视图入口
├─main-native.ts 程序入口
├─routes.ts 路由
├─vue.config.js 配置文件
├─typings
|    └shims-vue.d.ts ts识别vue配置
├─tools 工具类
|   ├─formatDate.ts
|   ├─user
|   ├─launch
├─pages 视图
|   ├─web
|   ├─settings
|   ├─search
|   ├─introduction
|   ├─live
|   ├─home
|   ├─filter
|   ├─detail
├─components 公共组件
|     ├─Header.vue
|     ├─LoadingError.vue
|     ├─NetworkError.vue
|     ├─bg-player.vue
|     ├─img-text-btn-view.vue
|     ├─qt-img-transition.vue
|     └top-btns-view.vue
├─build 全局配置
|   └BuildConfig.ts
├─assets 资源文件
├─api 全局api
|  ├─GlobalApiImpl.ts 全局接口实现入口
|  ├─IBaseApi.ts 
|  ├─IGlobalApi.ts 接口继承类
|  ├─RequestUrl.ts 请求地址
|  ├─UseApi.ts
|  ├─search 搜索api目录
|  ├─request 
|  ├─media
|  ├─home 首页api目录
|  ├─filter 筛选 api目录
```

