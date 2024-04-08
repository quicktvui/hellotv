import {
  QTPoster,
  QTWaterfall,
  QTWaterfallItem,
  QTWaterfallItemType,
  QTWaterfallSection,
  QTWaterfallSectionType,
  QTWaterfallVisibleType,
  QTMediaSeries
} from "@quicktvui/quicktvui3";
import { IMedia } from "../../../api/media/IMedia";
import { IMediaItemListType } from "../../../api/media/IMediaItemListType";
import { IMediaAuthType } from "../../../api/media/IMediaAuthType";

/**
 *
 */
export function buildWaterfall(): QTWaterfall {
  const waterfall: QTWaterfall = {
    width: 1920,
    height: 1080,
    visibleType: QTWaterfallVisibleType.QT_WATERFALL_VISIBLE_TYPE_NORMAL
  }
  return waterfall
}


export function buildSectionList(m: IMedia): Array<QTWaterfallSection> {
  let sectionList: Array<QTWaterfallSection> = [
    buildHeaderSection(),
    buildAlbumDetailSection(m),
    buildRecommendationSection(),
    buildEndSection()
  ]
  return sectionList
}

//------------------------------------------------------------------------------------

function buildEndSection(): QTWaterfallSection {
  let endSection: QTWaterfallSection = {
    _id: "6",
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
    title: "已经到底啦，按【返回键】回到顶部",
    titleStyle: {
      width: 1920,
      height: 200,
      marginLeft: 90,
      marginTop: 40,
      marginBottom: 40,
      fontSize: 30
    },
    itemList: [],
    style: {
      width: 1920,
      height: 200
    },
  }
  return endSection
}

export function buildHeaderSection(): QTWaterfallSection {
  let section: QTWaterfallSection = {
    _id: '1',
    type: 1,
    itemList: [],
    style: {
      width: 1920,
      height: 135,
    },
  }
  return section
}

export function buildAlbumDetailSection(m: IMedia): QTWaterfallSection {

  let sectionHeight = 550
  if (m.itemList.enable) {
    switch (m.itemList.type) {
      case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_NUMBER://数字
        sectionHeight = 815
        break
      case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_LEFT_RIGHT://左图右文
        sectionHeight = 896
        break
      case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_TEXT://文本
        sectionHeight = 835
        break
      case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_TOP_DOWN://上图下文
        sectionHeight = 945
        break
    }
  }

  let section: QTWaterfallSection = {
    _id: '2',
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_VUE,
    itemList: [],
    style: {
      width: 1920,
      height: sectionHeight
    },
  }
  return section
}

//--------------------------------------------------------------------------
export function buildRecommendationSection(): QTWaterfallSection {
  let section: QTWaterfallSection = {
    _id: '5',
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
    title: '相关推荐',
    titleStyle: {
      fontSize: 40,
      marginBottom: 25
    },
    itemList: [],
    decoration: {
      left: 90,
    },
    style: {
      width: 1740,
      height: 930,
      spacing: 36
    },
    //这里控制一下列表的滚动
    scrollOverride: {
      //在这个版块从下键移动时，下移1000
      down: 700, up: 0
    }
  }
  return section
}

export function buildRecommendationItemList(mediaList: Array<IMedia>): Array<QTWaterfallItem> {
  const itemList: Array<QTWaterfallItem> = []
  if (mediaList && mediaList.length) {
    for (let i = 0; i < mediaList.length; i++) {
      const m = mediaList[i]
      const item = buildRecommendationItem(m)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildRecommendationItem(media: IMedia): QTWaterfallItem {
  const poster: QTPoster = {
    type: QTWaterfallItemType.QT_WATERFALL_ITEM_TYPE_POSTER,
    focus: {
      enable: true,
      scale: 1.1
    },
    image: {
      src: media.coverV,
      enable: true,
      style: {
        width: 260,
        height: 368,
      }
    },
    title: {
      text: media.title ?? '',
      enable: true,
      style: {
        width: 260,
      }
    },
    focusTitle: {
      text: media.title ?? '',
      enable: true,
      style: {
        width: 260,
      }
    },
    score: {
      enable: true,
      style: {
        width: 260,
        height: 30,
        fontSize: 24,
        marginLeft: 15,
        marginTop: 325,
      },
      text: media.score,
    },
    style: {
      width: 260,
      height: 422,
    },
    titleStyle: {
      width: 260,
      marginTop: -60,
    },
    titleFocusStyle: { width: 260, marginTop: -65 },
    corner: {
      text: media.corner?.text ?? '',
      enable: media.corner?.text != '' && media.corner?.text != null && media.corner?.text != 'null',
      style: {
        width: 260,
        height: 30
      },
      background: {
        colors: [
          media.corner?.startColor ? media.corner?.startColor! : '#ffB67827',
          media.corner?.endColor ? media.corner?.endColor! : '#ffB67827'],
        cornerRadii4: [0, 8, 0, 8],
        orientation: 2
      }
    },
    item: media//
  }
  return poster
}

//------------------------------------选集组件数据--------------------------------------
export function buildMediaSeriesList(mediaList: Array<IMedia>): Array<QTMediaSeries> {
  const itemList: Array<QTMediaSeries> = []
  if (mediaList && mediaList.length) {
    for (let i = 0; i < mediaList.length; i++) {
      const m = mediaList[i]
      const item = buildMediaSeries(m)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildMediaSeries(media: IMedia): QTMediaSeries {
  const vip = media.authType == IMediaAuthType.MEDIA_AUTH_TYPE_VIP
  if (vip) {
    return {
      id: media.id,
      title: media.title,
      cover: media.coverH,
      flagText: "VIP",
      vip: {
        enable: true,
        text: "VIP"
      }
    }
  } else {
    return {
      id: media.id,
      title: media.title,
      cover: media.coverH,
      vip: {
        enable: false,
        text: "VIP"
      }
    }
  }
}
