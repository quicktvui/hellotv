# 搜索

## 页面功能

    页面支持两种布局方式，通过页面级配置文件config.ts中layoutMode来控制。

    layoutMode: 2 # 两栏布局，左侧键盘区域、右侧搜索关键词或搜索结果
                3 # 三栏布局，左侧键盘区域、中间搜索关键词、右侧搜索结果

## 页面布局

![image](../../../doc/search/design.png)

### 两栏页面（two-columns.vue）

    左侧键盘区域、右侧关键词或搜索结果。当右侧展示搜索结果时，页面支持横向滚动。

![image](../../../doc/search/two-columns.png)

![image](../../../doc/search/two-columns-2.png)

### 三栏页面（three-columns.vue）

    左侧键盘区域、中间搜索关键词、右侧搜索结果，页面支持横向滚动。

![image](../../../doc/search/three-columns.png)

## 目录结构

```bash
src/pages/search
├── README.md                               // 自述文件
├── adapter                                 // 数据转换及类型定义
│   ├── index.ts
│   └── interface.ts
├── api                                     // 网络请求
│   ├── index.ts
│   ├── interface.ts
│   └── request-url.ts
├── components                              // 页面组件
│   ├── search-content-item-h.vue
│   ├── search-content-item-v.vue
│   ├── search-content-tabs.vue
│   ├── search-content.vue
│   ├── search-keyboard.vue
│   ├── search-keyword-grid.vue
│   └── search-keyword.vue
├── scss                                    // 样式文件
│   ├── search-content.scss
│   ├── search-keyboard.scss
│   ├── search-keyword-grid.scss
│   ├── search-keyword.scss
│   └── search.scss
├── config.ts                               // 页面配置
├── three-columns.vue
└── two-columns.vue
```
