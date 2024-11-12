import { IHistoryMenuEntity } from "../../api/history/modelEntity";
import ThemeConfig from "../../config/theme-config";

export const pageWidth = 1920
export const layouts = {
    lt: 'leftTop', lb: 'leftBootom', rt: 'rightTop', rb: 'rightBootom'
}
export const menuListItemTypes = {
    txt: 1, img: 2, icon: 3
}

export interface Iconfig {
    layout: string;
    detailPageName:string;
    title?: string;//菜单标题
    titleImg?: string;
    menuStyle?: {//菜单按钮颜色
        normal: { color: string }
        focused: { color: string }
        selected: { color: string }
    };
    menuList?: IHistoryMenuEntity[];//优先从getMenuList方法中去数据，其次取属性menuList的数据
    emptyImg?: string;// https://qcloudcdn-moss.cp47.ott.cibntv.net/channelzero_image/web_static/extend_screen/public_images/ic_history_empty.png
    emptyTxt?: string;
    contentStyle?: {
        normal: { bgColor: string }
        focused: { bgColor: string }
    };
    contentColumn: number;
    contentItemHeight?:number
    contentSpace?:number //内容区间距, 必须大于0，否则不生效，默认20
    clearAllIsReset?:boolean //删除数据时，如果当前内容区全部删除后是否重新加载数据
    bgColor?:string|object //整体背景色 #000000 整体渐变背景色 {colors:['#252930', '#252930']}
    menuBgColor?:string[]//菜单背景色
    menuFocusedItemBg?:string[];//菜单按钮焦点状态背景色
    contentTitleHeight?:number;
    contentTitleSize?:number;
    contentSubTitleSize?:number;
    contentSubTitleHeight?:number,
    menuWidth:number//菜单宽度
}
const configs:Iconfig = {
    layout: layouts.lt,
    title: '全部记录',
    // menuBgColor: ['#024739','#023D30'],
    // titleImg: 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
    // menuStyle: {
    //     normal: { color: '#FFFFFF' },
    //     focused: { color: '#042F1F' },
    //     selected: { color: '#00FFA7' }
    // },
    menuList: [
      { id: 0, name: "观看历史", type: menuListItemTypes.txt },
      { id: 1, name: "我的收藏", type: menuListItemTypes.icon },
      { id: 2, name: "已购内容", type: menuListItemTypes.txt },
      { id: 3, name: "收藏专区", type: menuListItemTypes.txt },
    ],
    emptyTxt: '暂无数据～',
    contentColumn: 4,
    detailPageName: 'series_view',
    contentItemHeight: 0,
    contentSpace: 20,
    clearAllIsReset: true,
    contentTitleHeight: 42,
    contentTitleSize:32,
    contentSubTitleSize: 24,
    contentSubTitleHeight: 40,
    bgColor: ThemeConfig.rootBgColor,
    menuFocusedItemBg: ThemeConfig.btnGradientFocusColor,
    menuWidth: 320,
}
export default configs
