// 详情
export interface IMedia {
  //id
  id: string
  //标题
  title: string
  description: string
  //标签
  tags: string
  //评分
  actors: string
  score: string
  offLine: string
  vipType: string
  //集数
  episodes: number
  episodesId: string
  [prop: string]: any
}
//选集展示类型
export enum IMediaSeriesType {
  MEDIA_ITEM_LIST_TYPE_NUMBER = 0,
  MEDIA_ITEM_LIST_TYPE_LEFT_RIGHT = 1,
  MEDIA_ITEM_LIST_TYPE_TEXT = 2,
  MEDIA_ITEM_LIST_TYPE_TOP_DOWN = 3,
}
export enum IEpisodeAuthType {
  MEDIA_AUTH_TYPE_VIP = 0,
  MEDIA_AUTH_TYPE_FREE = 1,
}
// 选集item
export interface IMediaSeriesItem {
  //分集id
  id: string
  //分集展示的标题
  title: string
  subTitle: string
  cover: string
  //
  episode: number
  vipType: number
  [prop: string]: any
}
// 相关推荐item
export interface IRecommendItem {
  id: string
  title: string
  cover: string
  description: string
  tags: string
  actors: string
  score: number
  offLine: boolean
  vipType: number
  episodes: number
  episodesId: string
  [prop: string]: any
}

export enum IMediaPlayerViewState {
  MEDIA_PLAYER_VIEW_STATE_DISMISS = 0,
  MEDIA_PLAYER_VIEW_STATE_PROGRESS = 1,
  MEDIA_PLAYER_VIEW_STATE_MENU = 2,
}
export const MEDIA_PLAYER_ERROR_AUTH = -2000;

export interface IMediaPlayer extends QTIBaseView{

  play(media: IMedia)

  addMediaItemList(page: number, mediaList: Array<IMedia>)

  playMediaItemById(id: string)

  playMediaItemByIndex(index: number)

  getPlayingMediaIndex(): number

  setFloatWindow()

  setSmallWindow()

  getWindowType(): ESPlayerWindowType

  stop()

  release()

  resume()

  reset()

  setFullWindow(): void

  onKeyDown(keyEvent: ESKeyEvent): boolean

  onKeyUp(keyEvent: ESKeyEvent): boolean

  onBackPressed(): boolean

  changeVisible(value: boolean): void
}
  