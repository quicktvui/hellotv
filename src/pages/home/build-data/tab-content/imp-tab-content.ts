/**
 * tabContent
 */
import { LaunchParams } from '../../../../tools/launch'

export interface TabContent{
  //板块总数
  total?:number
  //二屏背景图
  backgroundImg?:string
  //板块列表
  sectionList:Array<Section>
  //自定义参数
  customParams?:any
}

/**
 * 板块数据
 */
export interface Section{
  id:string
  //板块类型 1：普通类型，2：一行滚动
  type:string
  //板块标题
  title:string
  //是否展示板块标题
  showTitle:boolean
  //板块高度样式
  style:{
    height:number
  }
  //板块中数据列表
  items:Array<SectionItem>
  //自定义参数
  customParams?:any
}

/**
 * 格子数据
 */
export interface SectionItem{
  id:string
  //格子类型：0：无标题，1：内标题，2：外标题，3：占位，4：文字历史，5：图片历史，6：焦点变图，7：小窗播放，8：小窗列表播放
  type:string
  //X坐标
  posX:number
  //Y坐标
  posY:number
  //标题
  title:string
  //副标题
  subTitle?:string
  //封面图
  image:string
  //封面图图片宽
  width:number
  //封面图图片高
  height:number
  //焦点图
  imageFocus?:string
  //焦点背景图
  imageFocusBackground?:string
  corner:string
  //背景播放内容Id
  playBackgroundId?:string
  //背景播放url
  playBackgroundUrl?:string
  //小窗播放、小窗列表播放数据
  playData?:Array<PlayData>
  //跳转数据
  jumpParams:LaunchParams
}

/**
 * 播放内容
 */
interface PlayData{
  id:string
  //标题
  title:string
  //封面图
  cover:string
  //缩略图
  thumbnail?:string
  //是否请求播放地址
  isRequestUrl:boolean
  //播放地址
  url:Array<{
    playUrl:string
    definition:string}>
}
