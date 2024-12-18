// 详情
export interface IDetailInfo {
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
  episodesId: string
  [prop: string]: any
}
//分集展示类型
export enum IEpisodeType {
  MEDIA_ITEM_LIST_TYPE_NUMBER = 0,
  MEDIA_ITEM_LIST_TYPE_LEFT_RIGHT = 1,
  MEDIA_ITEM_LIST_TYPE_TEXT = 2,
  MEDIA_ITEM_LIST_TYPE_TOP_DOWN = 3,
}
export enum IEpisodeAuthType {
  MEDIA_AUTH_TYPE_VIP = 0,
  MEDIA_AUTH_TYPE_FREE = 1,
}
// 分集item
export interface IEpisode {
  //分集id
  id: string
  //分集展示的标题
  title: string
  subTitle: string
  cover: string
  //
  episode: number
  vipType: number
  //分集展示类型
  type?: IEpisodeType
  [prop: string]: any
}

  