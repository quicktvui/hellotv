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
  previewImg?: string; //影视预览图地址
  previewVedio?: string;//影视预览视频地址
  title?: string;//影视标题
  titleImg?: string;//影视图片标题
  subTitle?: string;//影视副标题
  poster:string;//影视海报图地址
  tagStr?:string;//影视相关标签
  score?:string;//影视平分
  des?:string;//影视简介
  bgTags?:IbgTags[]//影视带背景色标签
}

export interface IrankingContent {
  type: Tvalues<typeof rankingTypes>;
  rankName:string;//排行榜类型名
  list: IrankingContentItem[]
}
export interface IrankingMoreContent {
  type: Tvalues<typeof rankingTypes>;
  moreList?: IrankingContent[];
}