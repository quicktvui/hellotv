import { IHistoryMenuEntity } from "src/api/history/modelEntity";

export const layouts = {
    lt: 'leftTop', lb: 'leftBootom', rt: 'rightTop', rb: 'rightBootom'
}
export const menuListItemTypes = {
    txt: 1, img: 2, icon: 3
}

export interface Iconfig {
    layout?: string;
    title?: string;
    titleImg?: string;
    menuStyle?: {
        normal: { color: string }
        focused: { color: string }
        selected: { color: string }
    };
    menuList?: IHistoryMenuEntity[];//优先从getMenuList方法中去数据，其次取属性menuList的数据
    emptyImg?: string;
    emptyTxt?: string;
    contentStyle?: {
        normal: { bgColor: string }
        focused: { bgColor: string }
    };
    contentColumn?: number;
    detailPageName?:string;
    contentItemHeight?:number
}
const configs:Iconfig = {
    layout: layouts.lt,
    title: '全部记录',
    // titleImg: 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
    menuStyle: {
        normal: { color: 'rgba(255, 255, 255, 0.5)' },
        focused: { color: '#000' },
        selected: { color: '#fff' }
    },
    menuList: [
        { id: 0, name: '观看历史', type: menuListItemTypes.txt },
        { id: 1, name: '我的收藏', type: menuListItemTypes.txt },
        { id: 2, name: '已购内容', type: menuListItemTypes.txt },
        { id: 3, name: '收藏专区', type: menuListItemTypes.txt },
    ],
    emptyTxt: '暂无数据～',
    contentColumn: 4,
    detailPageName: 'series_view',
    contentItemHeight: 0
}
export default configs