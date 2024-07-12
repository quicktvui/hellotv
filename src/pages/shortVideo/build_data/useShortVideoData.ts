import { QTPoster,QTITab, QTTab, QTTabEventParams, QTTabItem, QTTabPageData, QTTabPageState,QTWaterfallItem,
  QTListViewItem,
  QTWaterfallSection, QTWaterfallSectionType} from "@quicktvui/quicktvui3";
import { SearchCenter } from "./impl/SearchCenter"
import { SearchTab } from "./impl/SearchTab"
import { SearchResult } from "./impl/SearchResult"
import { buildSearchResultAdapter } from "./ShortVideoAdapter"

export function buildEndSection(sectionId: string): QTWaterfallSection {
let section: QTWaterfallSection = {
    _id: sectionId,
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
    title: '已经到底啦，按【返回键】回到顶部',
    style: {
        width: 1920,
        height: 200,
    },
    titleStyle:{
        fontSize:30
    },
    itemList: []
}
return section
}

// 构建 hotsearch 数据
export function buildSearchCenterListData(data: Array<any>,isHistoryList:boolean): SearchCenter {
  let centerData:SearchCenter
  let list:Array<QTListViewItem> = []
  data.map(item => list.push({ text: item, type: 1, decoration: { bottom: 12 }}))
  centerData = {
    isHistoryList,
    list
  }
  return centerData
}

// 构建搜索结果 tablist 数据
export function buildSearchTabData(tabs:Array<SearchTab>): Array<QTTabItem>{
  let tabList:Array<QTTabItem> = []
  tabs.forEach((item,index) =>{
    const tabItem:QTTabItem = {
      text:`${item.title} (${item.totalNum}+)`,
      title:`${item.title}`,
      titleSize:36,
      type:2,
      _id:item.id,
      decoration:{ left: index === 0 ? 66 : 16}
    }
    tabList.push(tabItem)
  })
  return tabList
}

export function buildSearchResultData(searchResultData: SearchResult,pageNo: number,singleTab:boolean):QTTabPageData{
  return buildSearchResultAdapter(searchResultData,pageNo,singleTab)
}


