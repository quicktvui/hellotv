import {
  QTMediaSeriesType, QTMediaSeriesGroup, QTMediaSeriesStyleType, QTMediaSeriesData
} from "@quicktvui/quicktvui3";
import {IMedia} from "../../../api/media/IMedia";
import {IMediaItemListType} from "../../../api/media/IMediaItemListType";


export function buildMediaSeriesType(media: IMedia): QTMediaSeriesType {
  let type: QTMediaSeriesType =
    QTMediaSeriesType.QT_MEDIA_SERIES_TYPE_LEFT_RIGHT
  switch (media.itemList.type) {
    case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_NUMBER://数字
      type = QTMediaSeriesType.QT_MEDIA_SERIES_TYPE_NUMBER
      break
    case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_LEFT_RIGHT://左图右文
      type = QTMediaSeriesType.QT_MEDIA_SERIES_TYPE_LEFT_RIGHT
      break
    case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_TEXT://文本
      type = QTMediaSeriesType.QT_MEDIA_SERIES_TYPE_TEXT
      break
    case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_TOP_DOWN://上图下文
      type = QTMediaSeriesType.QT_MEDIA_SERIES_TYPE_TOP_DOWN
      break
  }
  return type
}


export function buildMediaSeriesGroup(media: IMedia): QTMediaSeriesGroup {
  const group: QTMediaSeriesGroup = {
    enable: true,
    size: 10
  }
  return group
}

export function buildMediaSeriesStyleType(media: IMedia): QTMediaSeriesStyleType {
  const styleType: QTMediaSeriesStyleType =
    QTMediaSeriesStyleType.QT_MEDIA_SERIES_STYLE_TYPE_DEFAULT
  return styleType
}

export function buildMediaSeriesData(media: IMedia): QTMediaSeriesData {
  const data: QTMediaSeriesData = {
    initPosition: 0,
    pageSize: 10,
    totalCount: media.itemList?.count ?? 10000
  }
  return data
}
