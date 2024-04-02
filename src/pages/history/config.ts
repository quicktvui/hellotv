import { IHistoryMenuEntity } from "src/api/history/modelEntity";

export const layouts = {
  lt: 'leftTop', lb: 'leftBootom', rt: 'rightTop', rb: 'rightBootom'
}
export const menuListItemTypes = {
  txt: 1, img: 2, icon: 3
}

export interface Iconfig {
  layout: string;
  detailPageName: string;
  title?: string;
  titleImg?: string;
  menuStyle?: {
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
  contentItemHeight?: number
  contentSpace?: number //内容区间距, 必须大于0，否则不生效，默认20
  clearAllIsReset?: boolean //删除数据时，如果当前内容区全部删除后是否重新加载数据
  bgColor?: string | object //整体背景色 #000000 整体渐变背景色 {colors:['#252930', '#252930']}
  menuBgColor?: string[]//菜单背景色
  menuFocusedItemBg?: string[]
}
const configs: Iconfig = {
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
    { id: 1, name: '我的收藏', type: menuListItemTypes.icon },
    { id: 2, name: '已购内容', type: menuListItemTypes.txt },
    { id: 3, name: '收藏专区', type: menuListItemTypes.txt },
  ],
  emptyTxt: '暂无数据～',
  contentColumn: 5,
  detailPageName: 'series_view',
  contentItemHeight: 377,
  contentSpace: 22,
  clearAllIsReset: true
}
export default configs