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

//板块标题高度
const plateTitleHeight = 65
//有板块标题距离 top的高度
const firstPlate_Top = 250
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
      titleStyle: !!title ? { width: 1920, height: plateTitleHeight, marginBottom: 20, marginLeft: 90, fontSize: 38 } : { width: 1920, height: 0 },
      style: {
        width: 1920,
        height: -1,
      },
      decoration: {
        top: pageNo == 1 ? (singleTab ? (firstPlate_Top - singleTabTop_OffsetY) : firstPlate_Top) : 0,
        left: 0,
      },
      itemList: buildSearchResultItemAdapter(searchResultPageData.itemList)
    }
    if (section.itemList && section.itemList.length < SearchConfig.searchResultPageSize && pageNo > 1) { // 搜索结果只有首屏时，不展示底部提示
      let endSection: QTWaterfallSection = buildSearchEndSection('5');
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
      focus: {
        enable: true,
        scale: 1.03,
        border: true
      },
      type: 20,
      decoration: {
        left: (index % searchResultSpanCount) === 0 ? 90 : 40,
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

function buildSearchEndSection(sectionId: string): QTWaterfallSection {
  let section: QTWaterfallSection = {
    _id: sectionId,
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
    title: '已经到底啦，按【返回键】回到顶部',
    style: {
      width: 1920,
      height: 100,
    },
    titleStyle: {
      fontSize: 30
    },
    itemList: []
  }
  return section
}
