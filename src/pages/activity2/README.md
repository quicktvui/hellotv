## 在api/activity2/index.ts中重写Activity2BaseApi方法，自定义获取数据的逻辑
  - initPageData 初始化页面数据
  - getConfigs 获取页面基础配置
    - 返回 属性/样式 配置信息
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
            maskBg: 页面滚动时突出显示 顶部栏 的背景色
        };
        banner: { 固定模块-可配置内容区距离顶部的高度
            img 可配置图片
            style: {
                height: 内容区距离顶部的高度
            };
        };
  - getTopBtns 获取顶栏按钮数据
  - getList 获取活动板块数据
    - 返回数据需调用 getActivity2FlexBlock 生成板块数据，详见：api/activity2/base.ts 模拟数据的示例代码
        getActivity2FlexBlock({ 
            id: '5',//板块id
            title: '剑桥英语', //板块标题，不传则不显示
            list: [{
                id: item+'',//板块子项id
                img: dImgURL,//板块子项图片
                title: '',//板块子项标题
                subTitle: '',//板块子项副标题
                corner: '',//板块子项角标文字
                cornerBackground: '#000000',//角标背景色，支持字符串和渐变对象格式
                layout: { x: 0, y: 0, width: 300, height: 260 },//通过坐标和宽高，创建板块数据
                <!-- _redirectType: 0,
                _router: {},
                _action: {} -->
            }],
            options: { 
                columns: 6, //指定板块列数
                blackItemHeight: 260//指定板块内每个子项的图片高度
            }
        })
    - 板块子项列数的优先级
        - layout 大于 columns，当设置layout后可不传columns和blackItemHeight