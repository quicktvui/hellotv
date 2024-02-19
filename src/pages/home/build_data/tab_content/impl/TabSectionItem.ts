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
  cornerContent?: string
  cornerColor?: string
  cornerGradient?: string
  focusImage?: string
  nonFocusImage?: string
  playLogoSwitch: string
  playData?: Array<TabPlayItem>
  redirectType?:string
  action?:string
  innerArgs?:string
  [prop: string]: any
}
