import {TabPlayItem} from "./TabPlayItem";

export interface TabSectionItem {
  id:string,
  posX: number
  posY: number
  width: number
  height: number
  //0：普通格子；1：焦点变图格子；2无边框格子；3:占位格子；10008：小窗无列表轮播格子；10009：小窗列表轮播格子
  cellType: string | number
  //是否背景播放
  isBgPlayer?:boolean
  poster?: string
  posterTitle: string
  posterTitleStyle?: string
  posterSubtitle?: string
  floatTitle?: string
  //角标类型 0：文字，1：图片
  cornerStyle?:string
  //1:左上角，0：右上角
  cornerPosition?:string
  cornerContent?: string
  cornerColor?: string
  cornerGradient?: string
  cornerImage?:string,
  focusImage?: string
  nonFocusImage?: string
  playLogoSwitch: string
  playData?: Array<TabPlayItem>
  redirectType?:string
  action?:string
  innerArgs?:string
  [prop: string]: any
}
