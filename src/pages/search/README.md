# 搜索

## 页面功能

### 三栏页面（three-columns.vue）

    左侧键盘区域、中间搜索关键词、右侧搜索结果

![image](../../../doc/search/three-columns.png)

## 目录结构

```bash
src/pages/search
├── README.md                   // 自述文件
├── adapter                     // 数据适配器
│   ├── index.ts                // 相关函数
│   └── interface.ts            // 相关类型
├── components                  // 页面组件
│   ├── search-content.vue      // 内容
│   ├── search-keyboard.vue     // 键盘
│   └── search-keyword.vue      // 关键词
├── config.ts                   // 页面级配置
└── three-columns.vue           // 三栏页面入口
```
