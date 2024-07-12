import { ESGradient } from "@extscreen/es3-component";

type Tvalues<T> = T[ keyof T ];

export const rankingTypes = {
  sort: '1', more: '2'
} as const

export interface IrankingConfig {
  topHeight:number;
  gradientBg:ESGradient;
  pageSpace:number;
}

export interface IrankingTabItem {
  id: string,text: string;
}

interface IbgTags {id:string; txt: string};

export interface IrankingContentItem {
  id:string;
  previewImg?: string; //影视预览图地址
  previewVedio?: string;//影视预览视频地址
  title?: string;//影视标题
  titleImg?: string;//影视图片标题
  subTitle?: string;//影视副标题
  poster:string;//影视海报图地址
  tagStr?:string;//影视相关标签
  score?:string;//影视平分
  des?:string;//影视简介
  rankName?:string;//排行分类
  bgTags?:IbgTags[];//影视带背景色标签
}
export interface IposterConfig {
  posterWidth?:number; posterHeight?:number;
  posterImgWidth?:number; posterImgHeight?:number;
  posterRightSpace?:number; posterTopSpace?:number;
  [k:string]:any
}
export interface IrankingContent {
  id:string;
  type: Tvalues<typeof rankingTypes>;
  rankName:string;//排行榜类型名
  list: IrankingContentItem[];
  config?:IposterConfig;
}
export interface IrankingMoreContent {
  id:string;
  topSpace:number;//顶部偏移距离，可以是负数
  type: Tvalues<typeof rankingTypes>;
  moreList: IrankingContent[];
}