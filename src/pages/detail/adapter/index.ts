import {
  QTPoster,
  QTWaterfall,
  QTWaterfallItem,
  QTWaterfallItemType,
  QTWaterfallSection,
  QTWaterfallSectionType,
  QTWaterfallVisibleType,
  QTMediaSeriesType,
  QTMediaSeriesGroup,
  QTMediaSeriesStyleType,
  QTMediaSeriesData,
  QTMediaSeriesGroupStyle,
  QTMediaSeries,
  } from "@quicktvui/quicktvui3";
  // import { IMedia } from "../../../api/media/IMedia";
  import { IMedia, IMediaSeriesType, IMediaSeriesItem, IRecommendItem } from './interface'
  import ThemeConfig from "../../../config/theme-config";
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
  
  export function buildSectionList(media: IMedia): Array<QTWaterfallSection> {
    const sectionList: Array<QTWaterfallSection> = [
      buildHeaderSection(),
      buildAlbumDetailSection(media),
      buildRecommendSection(media),
      buildEndSection(),
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
  
  export function buildAlbumDetailSection(media: IMedia): QTWaterfallSection {
    let sectionHeight = 896;
    // if (m.itemList.enable) {
    //   switch (m.itemList.type) {
    //     // case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_NUMBER: //数字
    //     //   sectionHeight = 815;
    //     //   break;
    //     // case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_LEFT_RIGHT: //左图右文
    //     //   sectionHeight = 896;
    //     //   break;
    //     // case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_TEXT: //文本
    //     //   sectionHeight = 835;
    //     //   break;
    //     // case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_TOP_DOWN: //上图下文
    //     //   sectionHeight = 945;
    //     //   break;
    //   }
    // }
  
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
  
  //-----------------------------------相关推荐---------------------------------------

  export function buildRecommendSection(media: IMedia): QTWaterfallSection {
    let upOffset = 0;
    let downOffset = 800;
    if (media.episodes > 1) {
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
        left: 80,
      },
      style: {
        width: 1760,
        height: 930,
        spacing: 40,
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
  
  export function buildRecommendList(recommendList: Array<IRecommendItem>): Array<QTWaterfallItem> {
    const itemList: Array<QTWaterfallItem> = [];
    if (recommendList && recommendList.length > 0) {
      for (let i = 0; i < recommendList.length; i++) {
        const m = recommendList[i];
        const item = buildRecommendItem(m);
        item._id = i == 0 ? 'releatedFirstId' : ''
        itemList.push(item);
      }
    }
    return itemList;
  }
  
  export function buildRecommendItem(recommendItem: IRecommendItem): QTWaterfallItem {
    const poster: any = {
      type: 10011,
      image: {
        src: recommendItem.cover,
        enable: true,
        style: {
          width: 260,
          height: 368,
        },
      },
      title: {
        text: recommendItem.title ?? "",
        enable: true,
        style: {
          width: 260,
        },
      },
      score: recommendItem.score,
      style: {
        width: 260,
        height: 422,
      },
      corner: {
        text: recommendItem.corner?.text ?? "",
        enable:
        recommendItem.corner?.text != "" && recommendItem.corner?.text != null && recommendItem.corner?.text != "null",
        style: {
          width: 260,
          height: 30,
        },
        background: {
          colors: [
            recommendItem.corner?.startColor ? recommendItem.corner?.startColor! : "#ffB67827",
            recommendItem.corner?.endColor ? recommendItem.corner?.endColor! : "#ffB67827",
          ],
          cornerRadii4: [0, 8, 0, 8],
          orientation: 2,
        },
      },
      item: recommendItem, //
    };
    return poster;
  }
  
  //------------------------------------选集组件 adapter--------------------------------------

  export function buildMediaSeriesType(mediaSeriesType: IMediaSeriesType): QTMediaSeriesType {
    let type: QTMediaSeriesType = QTMediaSeriesType.QT_MEDIA_SERIES_TYPE_LEFT_RIGHT;
    switch (mediaSeriesType) {
      case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_NUMBER: //数字
        type = QTMediaSeriesType.QT_MEDIA_SERIES_TYPE_NUMBER;
        break;
      case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_LEFT_RIGHT: //左图右文
        type = QTMediaSeriesType.QT_MEDIA_SERIES_TYPE_CUSTOM; // 使用自定义左图右文
        break;
      case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_TEXT: //文本
        type = QTMediaSeriesType.QT_MEDIA_SERIES_TYPE_TEXT;
        break;
      case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_TOP_DOWN: //上图下文
        type = QTMediaSeriesType.QT_MEDIA_SERIES_TYPE_TOP_DOWN;
        break;
    }
    return type;
  }
  
  export function buildMediaSeriesGroup(): QTMediaSeriesGroup {
    const groupStyle: QTMediaSeriesGroupStyle = {
      groupMarginLeft: -100,
      itemWidth: 213,
      itemHeight: 52,
      itemGap: 16,
      mark: { color: "#00D9D9" },
      textColor: {
        normal: ThemeConfig.textColor,
        focused: ThemeConfig.textFocusColor,
        selected: ThemeConfig.textSelectColor,
      },
      focusBackground: {
        color: ThemeConfig.btnGradientFocusColor,
        cornerRadius: [8, 8, 8, 8],
        padding: [0, 0],
      },
      background: {
        color: ["#1Affffff", "#1Affffff"],
        cornerRadius: [8, 8, 8, 8],
        padding: [0, 0],
        stroke: {
          color: {
            normal: "#80FFFFFF",
            selected: "#80FFFFFF",
          },
          width: 0,
        },
      },
    };
    const group: QTMediaSeriesGroup = {
      enable: true,
      size: 10,
      groupStyle: groupStyle,
    };
    return group;
  }
  
  export function buildMediaSeriesStyleType(): QTMediaSeriesStyleType {
    const styleType: QTMediaSeriesStyleType =
      QTMediaSeriesStyleType.QT_MEDIA_SERIES_STYLE_TYPE_DEFAULT;
    return styleType;
  }
  
  export function buildMediaSeriesData(media: IMedia): QTMediaSeriesData {
    const data: QTMediaSeriesData = {
      initPosition: 0,
      pageSize: 10,
      totalCount: media.episodes ?? 10000,
    };
    return data;
  }

  export function buildMediaSeriesList(list: Array<IMediaSeriesItem>): Array<QTMediaSeries> {
    const itemList: Array<QTMediaSeries> = [];
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const m = list[i];
        const item = buildMediaSeries(m);
        itemList.push(item);
      }
    }
    return itemList;
  }
  
  export function buildMediaSeries(item: IMediaSeriesItem): QTMediaSeries {
    // const vip = media.authType == IMediaAuthType.MEDIA_AUTH_TYPE_VIP;
    const vip = true
    if (vip) {
      return {
        id: item.id,
        title: item.title,
        text: item.episode < 10 ? '0' + item.episode + '\u0020' + item.title : item.episode + item.title,
        cover: item.cover,
        flagText: "VIP",
        duartion: '47.20',
        vip: {
          enable: true,
          text: "VIP",
        },
      };
    } else {
      return {
        id: item.id,
        title: item.title,
        cover: item.cover,
        text: item.episode < 10 ? '0' + item.episode + '\u0020' + item.title : item.episode + item.title,
        duartion: '47.20',
        vip: {
          enable: false,
          text: "VIP",
        },
      };
    }
  }
  