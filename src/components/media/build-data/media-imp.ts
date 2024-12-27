import { QTListViewItemDecoration } from '@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItemDecoration'
import { QTWaterfallFlexStyle } from '@quicktvui/quicktvui3/dist/src/waterfall/core/QTWaterfallFlexStyle'

export interface IMediaUrl {
  definition: string
  playUrl: string
}

export interface IMediaList {
  id:string
  title?:string,
  subTitle?:string
  cover?:string
  url?:Array<IMediaUrl>
  isRequestUrl?:boolean
  payStatus?:number|string
  thumbnail?:string
  [prop:string]:any
}

export enum PlayMenuNameFlag{
  COLLECT = "collect",
  NEXT = "next",
  EPISODES = "episodes",
  RATE = "rate",
  RATE_ITEM = "rateItem",
  DEFINITION = "definition",
  DEFINITION_ITEM = "definitionItem",
  SETTING = "setting",
  SETTING_ITEM = "settingItem"
}

export interface IMediaMenu {
  type:number
  nameFlag:PlayMenuNameFlag
  iconNormal?:string
  iconFocus?:string
  name:string
  decoration?:QTListViewItemDecoration
  style?:QTWaterfallFlexStyle
  [prop:string]:any
}