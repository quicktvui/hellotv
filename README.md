# hello tv
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://opensource.org/licenses/apache-2-0)
[![vue version](https://img.shields.io/badge/vue-3.2-green.svg)](https://github.com/vuejs/core)
[![vue version](https://img.shields.io/badge/@quicktvui/quicktvui3-latest-green.svg)](https://www.npmjs.com/package/@quicktvui/quicktvui3?activeTab=versions)

基于 [QuickTVUI](http://v3.quicktvui.com/zh/) 专为快速打造安卓TV影视应用而开发的示例项目。
项目主要目的是让开发者通过对本项目的简单修改，实现一些TV端常见的功能页面，从而加速开发者开发TV类影视类应用。
主要页面包括瀑布流首页、媒资列表、搜索、视频观看详情等，以下是一些页面效果：

瀑布流首页
![image](https://extcdn.hsrc.tv/extend_screen/images/example_app/bgplay.png)
搜索
![image](https://extcdn.hsrc.tv/extend_screen/images/example_app/search.png)
筛选
![image](https://extcdn.hsrc.tv/extend_screen/images/example_app/filter.png)
详情页
![image](https://extcdn.hsrc.tv/extend_screen/images/example_app/detail.png)
多级列表页
![image](doc/live1.png)
![image](doc/live2.png)
内容编辑页
![image](doc/edit.png)
<!-- [![Build Status](https://travis-ci.org/your-username/your-project.svg?branch=master)](https://travis-ci.org/your-username/your-project) -->
<!-- [![npm version](https://badge.fury.io/js/your-package.svg)](https://badge.fury.io/js/your-package) -->

> 目前项目仅供参考，代码逐步完善中，请暂勿用于正式项目中。
> release版本会于近期推出，敬请期待！



## 快速开始

### 调试
#### 1. 确认编译环境
建议windows:
- node version 16.20.2
- npm version 8.10


#### 2. 安装运行Runtime
下载并安装 [运行环境](http://v3.quicktvui.com/zh/resource/runtime.html) (需要日志时使用debug包，否则使用release)</b>

#### 3. 安装依赖
进入项目录下
```bash
npm install --legacy-peer-deps
```
#### 4. 编译调试
```bash
npm run dev
```
#### 5. 打开运行Runtime apk，查看效果
点击下图加载测试代码
![image](https://github.com/quicktvui/hellotv/assets/11962446/4571fb02-b761-405e-bbc8-a6baaa6f8a4a)
>> 注意这里电脑调试地址要改成你电脑本机ip
```bash
adb shell am broadcast -a  com.extscreen.runtime.ACTION_CHANGE_DEBUG_SERVER --es ip 192.168.xx.xx(电脑IP地址)
```
关于adb等其它配置具体说明请查看 <u>[安装和环境配置]([http://developer.extscreen.com/guide/](http://v3.quicktvui.com/zh/guide/installation.html)) </u>


最后看到加载出页面，表示完成调试，即可随时修改源码查看效果。


最后看到加载出页面，表示完成调试，即可随时修改源码查看效果。
## 源码修改
接入网络数据的准备工作请查看[PROJECT-README.md](PROJECT-README.md)
通过对每个页面提供的接口进行数据替换，即可实现自己的业务逻辑。

如有定制样式需求，可自行修改页面里样式文件。

具体可查看[/src/pages](./src/pages)目录下对应README说明。


## 开发进度
- [x] 瀑布流首页
- [x] 搜索页
- [x] 媒资详情页
- [x] 筛选页(开发中)
- [x] 多级列表页

以上页面开发完成，正在debug中

开发中
- [ ] 内容编辑页

计划中
- [ ] 短视频浏览

## 关于QuickTVUI
QuickTVUI是基于[Hippy](https://github.com/Tencent/Hippy)框架实现的TV快应用开发框架，旨在解决大屏开发困难、更新困难等疑难问题。  
它具有以下特征：
- 开发便捷：内置了大量针对智能电视开发的UI组件，简单易用;
- 快速更新：利用前端生态，实现免下载、免安装，方便快速迭代；
- 接近原生的体验：采用react-native的形式,底层用native实现，保证接近原生的体验;
- 全面兼容：已适配市面上大部分型号的智能电视、盒子、智能投影等，可免除开发者大量的适配工作;


<!-- ## 文档 -->
<!-- 查看完整的文档和示例，请访问[quicktvUI](http://quicktvui.com/)文档。 -->

## 贡献
我们欢迎并鼓励贡献，您可以通过以下方式参与：
- 提交错误报告或功能请求
- 提交拉取请求
<!-- 请阅读[贡献指南](CONTRIBUTING.md)获取更多信息。 -->
## 许可证
该项目基于Apache2.0许可证。请查阅 [LICENSE](https://opensource.org/licenses/apache-2-0) 文件以获取更多信息。

## 支持

如果您有任何问题或疑问，请通过以下方式联系我们：

- 邮箱：zhaopeng1@huan.tv
