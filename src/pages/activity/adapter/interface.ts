
import { IMediaUrl } from '../../../components/media/build-data/media-imp'
import { LaunchParams } from '../../../tools/launch'
/**
 * tabContent
 */
export interface TabContent {
  //板块总数
  total?: number
  //二屏背景图
  backgroundImage?: string
  //板块列表
  sections: Array<Section>
  //自定义参数
  customParams?: any
}

/**
 * 板块类型
 */
export enum SectionType {
  //普通板块
  TYPE_DEFAULT = 1,
  //一行滚动板块
  TYPE_LINE_SCROLL = 2,
  //放映厅板块
  TYPE_SWIPER_PLAY = 3
}

/**
 * 板块数据
 */
export interface Section {
  id: string
  //板块类型 1：普通类型，2：一行滚动, 3:轮播播放（小 4K）
  type: SectionType
  //板块标题
  title: {
    text?:string
    image?:string
    style?:{
      width:number
      height:number
    }
  }
  floatTitle?:string
  subTitle?:string
  //是否展示板块标题
  showTitle: boolean
  //板块高度样式
  style: {
    height: number
  }
  //板块中数据列表
  items: Array<SectionItem>
  //自定义参数
  customParams?: any
  contentId?:string
  contentType?:string
}

/**
 * 格子类型
 */
export enum SectionItemType {
  //无标题
  TYPE_DEFAULT = 0,
  //内标题
  TYPE_INNER = 1,
  //外表体
  TYPE_OUT = 2,
  //占位
  TYPE_PLACE_HOLDER = 3,
  //文字历史格子
  TYPE_TEXT_HISTORY = 4,
  //图片历史格子
  TYPE_IMG_HISTORY = 5,
  //焦点变图
  TYPE_FOCUS_CHANGE_IMG = 6,
  //小窗播放格子
  TYPE_SMALL_PLAY = 7,
  //小窗列表播放格子
  TYPE_SMALL_LIST_PLAY = 8,
  //轮播图片格子
  TYPE_LOOP_IMAGE = 9,
}

/**
 * 格子数据
 */
export interface SectionItem {
  id: string
  //格子类型：0：无标题，1：内标题，2：外标题，3：占位，4：文字历史，5：图片历史，6：焦点变图，7：小窗播放，8：小窗列表播放
  type: SectionItemType
  //X坐标
  posX: number
  //Y坐标
  posY: number
  //标题
  title: string
  //副标题
  subTitle?: string
  //封面图
  image: string
  //封面图图片宽
  width: number
  //封面图图片高
  height: number
  //焦点图
  imageFocus?: string
  //焦点背景图
  imageFocusBackground?: string
  corner: Corner
  //背景播放内容Id
  playBackgroundId?: string
  //背景播放url
  playBackgroundUrl?: string
  //小窗播放、小窗列表播放数据
  playData?: Array<PlayData>
  //跳转数据
  jumpParams: LaunchParams
}

export interface Section4KItem{
  id:string
  //标题
  title:string
  //副标题
  subTitle:string
  //封面图
  image:string
  //播放数据
  playData: Array<PlayData>
  //跳转数据
  jumpParams: LaunchParams
}

interface Corner{
  text:string
  textGradient?:Array<string>
  image:string
  imageStyle:{
    width:number
    height:number
  }
}

/**
 * 视频类型
 */
export enum PlayType {
  //正片长视频类型
  TYPE_LONG = 1,
  //短视频类型
  TYPE_SHORT = 2,
}

/**
 * 播放内容
 */
export interface PlayData {
  id: string
  type: PlayType
  //标题
  title: string
  //封面图
  cover: string
  //缩略图
  thumbnail?: string
  //是否请求播放地址
  isRequestUrl: boolean
  //播放地址
  url?: Array<IMediaUrl>
}
