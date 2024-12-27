# 筛选

## 页面功能

### 基础单页面（singleContents.vue）

### 左侧筛选项列表、右侧基础单页面（sidebarContents.vue）

### 左侧筛选项列表(支持向左扩展一级筛选项列表)、右侧基础单页面（expandSidebarContents.vue）

## 目录结构

```bash
src/pages/filter
├── README.md
├── adapter                              // 数据转换
│   ├── index.ts
│   └── interface.ts
├── components                           // 页面组件
│   ├── content                          // 右侧内容
│   │   ├── grid-item-h.vue
│   │   ├── grid-item-v.vue
│   │   ├── index.vue
│   │   └── list-item.vue
│   ├── expand                           // 左侧筛选列表扩展
│   │   └── index.vue
│   └── sidebar                          // 左侧筛选列表
│       ├── index.vue
│       ├── list-item-filter-title.vue
│       ├── list-item-filter.vue
│       ├── list-item-line.vue
│       ├── list-item-text.vue
│       └── list-item-title.vue
├── scss
│   └── filter-sidebar.scss
├── config.ts                            // 页面级配置
├── expandSidebarContents.vue
├── sidebarContents.vue
└── singleContents.vue
```
