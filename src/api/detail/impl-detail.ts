
export interface IMedia {
  //id
  id: string
  //标题
  title?: string
  //副标题
  subtitle?: string
  type: string
  //简介
  introduction: string
  //标签
  tags: string
  //竖向封面
  coverV: string
  //横向封面
  coverH: string
  //导演
  directors: string
  //演员
  actors: string
  //语言
  language: string
  //发行时间
  releaseDate: string
  //版权号
  licenceNum: string
  //评分
  score: string
  //角标
  corner?: IMediaCorner
  //分集信息
  itemList: IMediaItemList
  //权益类型
  authType?: IMediaAuthType
  //平台ID
  platformId?: string

  [prop: string]: any
}
