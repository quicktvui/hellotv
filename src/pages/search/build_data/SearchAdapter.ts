import { SearchResult } from "./impl/SearchResult"
import {
  QTPoster,
  QTTabPageData,
  QTWaterfallItem,
  QTWaterfallSection,
  QTWaterfallSectionType
} from "@quicktvui/quicktvui3"
import { SearchResultItem } from "./impl/SearchResultItem"
import SearchConfig from "./SearchConfig"
import { buildEndSection } from "../../home/build_data/tab_content/page"
//板块标题高度
const plateTitleHeight = 65
//有板块标题距离 top的高度
const hasPlateTitle_Top = 200
//无板块标题距离 top的高度
const noPlateTitle_Top = 250
//单个 Tab top的高度偏移量
const singleTabTop_OffsetY = 60
//板块一行个数
const searchResultSpanCount = 6


export function buildSearchResultAdapter(searchResultPageData: SearchResult, pageNo: number, singleTab: boolean): QTTabPageData {
  let tabPage: QTTabPageData = {
    useDiff: false,
    data: []
  }
  if (searchResultPageData) {
    const title = searchResultPageData.plateName
    let section: QTWaterfallSection = {
      _id: searchResultPageData.id,
      type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
      title,
      titleStyle: title != '' ? { width: 1920, height: plateTitleHeight, marginTop: 45, marginBottom: 20, marginLeft: 90, fontSize: 38 } : { width: 1920, height: 0 },
      style: {
        width: 1920,
        height: -1,
      },
      decoration: {
        top: pageNo == 1 ? singleTab ? (title !== '' ? hasPlateTitle_Top - singleTabTop_OffsetY : noPlateTitle_Top - singleTabTop_OffsetY) : (title !== '' ? hasPlateTitle_Top : noPlateTitle_Top) : 0,
        left: 0,
      },
      itemList: buildSearchResultItemAdapter(searchResultPageData.itemList)
    }
    if (section.itemList && section.itemList.length < SearchConfig.searchResultPageSize) {
      let endSection: QTWaterfallSection = buildEndSection('5');
      tabPage = {
        useDiff: false,
        data: [section, endSection]
      }
    } else {
      tabPage = {
        useDiff: false,
        data: [section]
      }
    }
  }
  return tabPage
}

export function buildSearchResultItemAdapter(list: Array<SearchResultItem>): Array<QTWaterfallItem> {
  let data: Array<QTWaterfallItem> = []
  list.forEach((item, index) => {
    const poster: QTPoster = {
      _id: item.id + "i",
      sid: item.id + "",
      focus: {
        enable: true,
        scale: 1.03,
        border: true
      },
      type: 20,
      decoration: {
        left: (index % searchResultSpanCount) === 0 ? 90 : 30,
        bottom: 40
      },
      title: {
        text: item.title,
        enable: true,
        style: {
          width: 270,
        }
      },
      subTitle: {
        text: "",
        enable: false,
        style: {
          width: 260,
        }
      },
      focusTitle: {
        text: item.title,
        enable: true,
        style: {
          width: 270,
        }
      },
      floatTitle: {
        text: '',
        enable: false,
        style: {
          width: 260,
        },
        background: { colors: ['#e5000000', '#00000000'], orientation: 4 }
      },
      shimmer: {
        enable: false,
      },
      ripple: {
        enable: false,
        src: "",
        style: {
          right: 0,
          bottom: 0,
          marginRight: -12,
        }
      },
      image: {
        src: item.poster,
        enable: true,
        style: {
          width: 270,
          height: 377
        }
      },
      corner: {
        text: item.corner,
        enable: false,
        style: {
          width: 260,
          height: 30
        },
        background: {
          colors: ['#A06419', '#CDA048'],
          cornerRadii4: [0, 8, 0, 8],
          orientation: 2
        }
      },
      style: {
        width: 270,
        height: 437,
      },
      titleStyle: {
        width: 270,
        height: 120,
        marginTop: 377 - 60,
      },
      titleFocusStyle: { width: 270, marginTop: 377 - 72 },
      item,
    }
    data.push(poster)
  })
  return data
}
