import { TtopModes, ITopMenuBarBtns, ItopMenuBarLogo } from '../../components/TopMenuBar/index'
// @ts-ignore
import type { TposterType } from '../../pages/detail2/index.ts'

export interface IAnyobj {
  [k: string]: any
}
type Tvalues<T> = T[ keyof T ]

export interface IDetail2Config {
  isShowTop:boolean;
  topMode: TtopModes
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
export interface IvideoDesAction {
  id: number|string, txt:string; type: number;
  color?:string; bgColor?:string; gradientBg?:object;gradientBgf?:object;
  gap?:number;//间隙
  icon?:any; iconf?: any; img?:any;
  foLayoutStyle?: { width: string; height:string; };//强制覆盖样式
  foImgStyle?: { width: string; height:string; };//强制覆盖图片样式
  [k:string]:any
}
export interface IvideoDes {
  title: string; topDistance?:number;
  tags: Array<Itag>;
  actions: Array<IvideoDesAction>;
  des?:string;//视频简介信息
}


//选集相关类型定义--------------------------------
export const IselectionPosterTypes = {
  poster: 10001, btn: 1
} as const;

export interface IselectionPoster {
  id:string;
  title?:string;
  subTitle?:string;
  poster:string;//预览图
  corner?:string;//角标
  imgCorner?:string;//图片角标
  _type?:Tvalues<typeof IselectionPosterTypes>;
  _router?:{
    url:string;params:object
  };
  _config?: {
    imgWidth?: number, imgHeight?:number
  }
}
export interface IselectionBaseSection {
  id:string;
  title?:string;
  itemList:TposterType[];
  _config?: {
    space?:number
  }
}
export interface IselectionSection {
  id:string;
  title?:string;
  tabList: Array<{
    id:string;
    title?:string;
    _config?: {
      space?:number
    };
    tabList: Array<{
      id:string;
      title?:string;
      _config?: {
        space?:number
      };
      itemList:TposterType[];
    }>;
  }>;
  _config?: {
    space?:number
  }
}