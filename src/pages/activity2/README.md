## 在src/activity2/config.ts中自定义样式和布局
- 属性/样式
    bgColor 背景色
    bgImg?: 背景图，优先级高于背景色
    top: { 顶部栏配置
        mode 模式-左右或右左
        title 标题
        titleStyle: {
            color 标题颜色
            fontSize 标题字体
        };
        btnListWidth: 按钮总宽度
    };
    banner: { 固定模块-可配置内容区距离顶部的高度
        img 可配置图片
        style: {
            height: 内容区距离顶部的高度
        };
    };
## 在api/activity2/index.ts中重写Activity2BaseApi方法，自定义获取数据的逻辑
  - getTopBtns 获取顶栏按钮数据
  - getList 获取活动板块数据