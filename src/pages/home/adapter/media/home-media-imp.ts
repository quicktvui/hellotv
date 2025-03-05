import { IMediaList } from '../../../../components/media/build-data/media-imp'
/**
 * 首页播放类型
 */
export enum HomePlayType{
  //未知
  TYPE_UNDEFINED = -1,
  //小窗播放
  TYPE_CELL = 0,
  //小窗列表播放
  TYPE_CELL_LIST = 1,
  //背景播放
  TYPE_BG = 2,
  //4K 播放
  TYPE_4K = 3,
  //短视频 全屏背景播放
  TYPE_SHORT_SCREEN = 4,
  //小 4K 播放
  TYPE_SMALL_4K = 5
}

/**
 * 播放状态
 */
export enum PlayerState{
  //默认
  STATE_WAIT = -1,
  //开始
  STATE_START = 0,
  //播放中
  STATE_PLAYING = 1,
  //暂停
  STATE_PAUSE = 2,
  //停止
  STATE_STOP = 3,
  //恢复播放器播放
  STATE_RESUME = 4,
  //重置播放器
  STATE_RESET = 5,
  //回收播放器资源
  STATE_RELEASE = 6,
}

/**
 * 首页播放器数据
 */
export interface HomePlayData{
  //播放类型
  type:HomePlayType
  //播放窗口宽
  windowWidth:number
  //播放窗口高
  windowHeight:number
  //播放器窗口宽
  playerWidth:number
  //播放器窗口高
  playerHeight:number
  //播放数据
  playerData:Array<IMediaList>
  //播放器窗口距离左边距离
  playerLeft:number
  //播放器窗口距离顶部距离
  playerTop:number
  [prop:string]:any
}
