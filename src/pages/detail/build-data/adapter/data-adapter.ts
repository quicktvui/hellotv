import {
  QTPoster,
  QTWaterfall,
  QTWaterfallItem,
  QTWaterfallItemType,
  QTWaterfallSection,
  QTWaterfallSectionType,
  QTWaterfallVisibleType,
  QTMediaSeries,
  } from "@quicktvui/quicktvui3";
  // import { IMedia } from "../../../api/media/IMedia";
  import { IDetailInfo } from '../interface/index'
  // import { IMediaItemListType } from "../../../api/media/IMediaItemListType";
  // import { IMediaAuthType } from "../../../api/media/IMediaAuthType";
  
  /**
   *
   */
  export function buildWaterfall(): QTWaterfall {
    const waterfall: QTWaterfall = {
      width: 1920,
      height: 1080,
      visibleType: QTWaterfallVisibleType.QT_WATERFALL_VISIBLE_TYPE_NORMAL,
    };
    return waterfall;
  }
  
  export function buildSectionList(m: IDetailInfo): Array<QTWaterfallSection> {
    let sectionList: Array<QTWaterfallSection> = [
      buildHeaderSection(),
      // buildAlbumDetailSection(m),
      // buildRecommendationSection(m),
      // buildEndSection(),
    ];
    return sectionList;
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
        fontSize: 30,
      },
      itemList: [],
      style: {
        width: 1920,
        height: 200,
      },
    };
    return endSection;
  }
  
  export function buildHeaderSection(): QTWaterfallSection {
    let section: QTWaterfallSection = {
      _id: "1",
      type: 1,
      itemList: [],
      style: {
        width: 1920,
        height: 135,
      },
    };
    return section;
  }
  
  export function buildAlbumDetailSection(m: IDetailInfo): QTWaterfallSection {
    let sectionHeight = 550;
    if (m.itemList.enable) {
      switch (m.itemList.type) {
        // case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_NUMBER: //数字
        //   sectionHeight = 815;
        //   break;
        // case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_LEFT_RIGHT: //左图右文
        //   sectionHeight = 896;
        //   break;
        // case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_TEXT: //文本
        //   sectionHeight = 835;
        //   break;
        // case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_TOP_DOWN: //上图下文
        //   sectionHeight = 945;
        //   break;
      }
    }
  
    let section: QTWaterfallSection = {
      _id: "2",
      type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_VUE,
      itemList: [],
      style: {
        width: 1920,
        height: sectionHeight,
      },
    };
    return section;
  }
  
  //--------------------------------------------------------------------------
  export function buildRecommendationSection(media: IDetailInfo): QTWaterfallSection {
    let upOffset = 0;
    let downOffset = 800;
    if (media.itemList.enable) {
      upOffset = 0;
      downOffset = 1000;
    }
  
    let section: QTWaterfallSection = {
      _id: "5",
      type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
      title: "相关推荐",
      titleStyle: {
        height:60,
        fontSize: 40,
        marginBottom: 25,
      },
      itemList: [],
      decoration: {
        left: 90,
      },
      style: {
        width: 1740,
        height: 930,
        spacing: 36,
      },
      //这里控制一下列表的滚动
      scrollOverride: {
        //在这个版块从下键移动时，下移1000
        down: downOffset,
        up: upOffset,
      },
    };
    return section;
  }
  
  export function buildRecommendationItemList(mediaList: Array<IDetailInfo>): Array<QTWaterfallItem> {
    const itemList: Array<QTWaterfallItem> = [];
    if (mediaList && mediaList.length) {
      for (let i = 0; i < mediaList.length; i++) {
        const m = mediaList[i];
        const item = buildRecommendationItem(m);
        item._id = i == 0 ? 'releatedFirstId' : ''
        itemList.push(item);
      }
    }
    return itemList;
  }
  
  export function buildRecommendationItem(media: IDetailInfo): QTWaterfallItem {
    const poster: any = {
      type: 10011,
      image: {
        src: media.coverV,
        enable: true,
        style: {
          width: 260,
          height: 368,
        },
      },
      title: {
        text: media.title ?? "",
        enable: true,
        style: {
          width: 260,
        },
      },
      score: media.score,
      style: {
        width: 260,
        height: 422,
      },
      corner: {
        text: media.corner?.text ?? "",
        enable:
          media.corner?.text != "" && media.corner?.text != null && media.corner?.text != "null",
        style: {
          width: 260,
          height: 30,
        },
        background: {
          colors: [
            media.corner?.startColor ? media.corner?.startColor! : "#ffB67827",
            media.corner?.endColor ? media.corner?.endColor! : "#ffB67827",
          ],
          cornerRadii4: [0, 8, 0, 8],
          orientation: 2,
        },
      },
      item: media, //
    };
    return poster;
  }
  
  //------------------------------------选集组件数据--------------------------------------
  export function buildMediaSeriesList(mediaList: Array<IDetailInfo>): Array<QTMediaSeries> {
    const itemList: Array<QTMediaSeries> = [];
    if (mediaList && mediaList.length) {
      for (let i = 0; i < mediaList.length; i++) {
        const m = mediaList[i];
        const item = buildMediaSeries(m);
        itemList.push(item);
      }
    }
    return itemList;
  }
  
  export function buildMediaSeries(media: IDetailInfo): QTMediaSeries {
    // const vip = media.authType == IMediaAuthType.MEDIA_AUTH_TYPE_VIP;
    const vip = true
    if (vip) {
      return {
        id: media.id,
        title: media.title,
        cover: media.coverH,
        flagText: "VIP",
        vip: {
          enable: true,
          text: "VIP",
        },
      };
    } else {
      return {
        id: media.id,
        title: media.title,
        cover: media.coverH,
        vip: {
          enable: false,
          text: "VIP",
        },
      };
    }
  }
  