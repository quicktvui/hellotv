import { TtopModes, ITopMenuBarBtns, ItopMenuBarLogo } from '../../components/TopMenuBar/index'
// @ts-ignore
import type { TposterType } from '../../pages/detail2/index.ts'

export interface IAnyobj {
  [k: string]: any
}
type Tvalues<T> = T[ keyof T ]

export interface IDetail2Config {
  isShowTop:boolean;
  topMode: TtopModes;
  desTopDistance:number;//视频节目信息距离顶部的距离
}

// top------
export interface Id2TopData {
  logo?: ItopMenuBarLogo;
  btns: Array<ITopMenuBarBtns>
}

// video-des
export const tagModes = {
  txt: 'txt', tag: 'tag', btn: 'btn'
} as const;
export interface Itag {
  id: number|string,txt:string; showSplit?:boolean;
  mode?:Tvalues<typeof tagModes>;//标签类型：文本/标签/按钮
  color?:string; bgColor?:string; borderColor?:string;
  gap?:number;//间隙
}
export const IvideoDesActionTypes = {
  btn: 1, btn2: 2, img: 3
}
export const IvideoDesActions = {
  fullScreen:'1', des:'2', ranking: '3', vip: '4'
} as const;
export interface IvideoDesAction {
  id: number|string, txt:string; type: number;
  action:Tvalues<typeof IvideoDesActions>;
  color?:string; bgColor?:string; gradientBg?:object;gradientBgf?:object;
  gap?:number;//间隙
  icon?:any; iconf?: any; img?:any;
  foLayoutStyle?: { width: string; height:string; };//强制覆盖样式
  foImgStyle?: { width: string; height:string; };//强制覆盖图片样式
  router?:{
    name: string; params?:object;
  }
  [k:string]:any
}
export interface IvideoDes {
  id:string|number;//视频唯一id
  title: string;//视频标题
  tags?: Array<Itag>;//视频类型标签
  actions?: Array<IvideoDesAction>;//视频信息展示模块的动作按钮列表
  des?:string;//视频简介信息
  playNumber?:number;//播放量
  status?:string;//视频状态 已完结 7月20日更新
  actors?:string;//演员信息
}


//选集相关类型定义--------------------------------
export const posterTypes = {
  hPoster: 20001, btn: 1, bigBtn: 4
} as const;
export const tabTypes = {
  btn: 1, text: 2, smallText: 3
} as const;

export interface IselectionPoster {
  id:string;
  title?:string;//选集标签中显示的标题
  subTitle?:string;//选集标签中显示的副标题
  poster:string;//选集标签中显示的预览图
  videoUrl?:string;
  corner?:string;//选集标签中显示的角标
  imgCorner?:string;//选集标签中显示的图片角标
  _type?:Tvalues<typeof posterTypes>;//选集标签中展示的格子类型
  _router?:{
    url:string;params:object
  };
  _config?: {//选集标签中显示的格子合模型配置数据
    imgWidth?: number, imgHeight?:number
  },
  videoData: IvideoDes//视频信息数据
}
export interface IselectionBaseSection {
  id:string;
  title?:string;
  itemList:TposterType[];
  _config?: {
    space?:number
  }
}
export interface ItabListItem {
  id:string;
  type?: Tvalues<typeof tabTypes>;
  name?:string;//标签项tab-bar名称
  itemList?:TposterType[];//标签项对应的格子列表数据
  tabList?: Array<ItabListItem>;//下一级标签页列表 itemList和tabList只能同时存在一个
  _config?: { space?:number };
  [k:string]:any
}
export interface IselectionSection {
  id:string;
  title?:string;//板块标题
  tabList: Array<ItabListItem>;//标签页列表
  _config?: {
    space?:number
  }
}