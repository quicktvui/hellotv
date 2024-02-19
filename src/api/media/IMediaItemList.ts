import {IMediaItemListType} from "./IMediaItemListType";

export interface IMediaItemList {
  //分集id
  id: string
  //分集展示的标题
  title: string
  //分集总数量
  count: number
  //分集展示类型
  type: IMediaItemListType
  //
  enable: boolean
}
