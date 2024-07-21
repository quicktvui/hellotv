import type {
  QTWaterfallSection, QTWaterfallItem
} from "@quicktvui/quicktvui3";
import { QTWaterfallSectionType, QTWaterfallItemType } from "@quicktvui/quicktvui3";
import type { IselectionPoster, IselectionBaseSection, IselectionSection,ItabListItem } from '../../api/details2/types'
import { selectionPosterTypes } from '../../api/details2/types'
import { getPosterConfig } from '../../components/Hposter/configs'

export const D2SelectionsSectionTypes = {
  selection: 1
}

const sWaterfallWidth = 1920
const sWaterfallHeight = 470

const dSectionSpace = 96
const dSectionTitleSize = 42
const dSectionTitleBottom = 30

export const getSelectionPoster = (sData:IselectionPoster):QTWaterfallItem => {
  const config = getPosterConfig({
    ...sData, titleLines: (sData.title||'').length>11?2:1
  })
  if(sData._type){
    config.type = sData._type
  }
  return {
    ...config,
    _router: sData._router,
  }
}

export const selectionTypes = {
  selection: 1, more: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_LIST
}
export const ids = {
  selection: 'selection'
}
export const getSelectionSectionTabs = (data:ItabListItem) => {
  const space = data._config?.space || dSectionSpace
  const type = data.type||selectionPosterTypes.text
  let tHeight = 90
  if(data.tabList?.[0]?.type === selectionPosterTypes.btn){
    tHeight = 120;
  }
  const firstListItem = data.itemList?.[0]
  let listItemHeight = firstListItem?.style.height||0
  if(firstListItem?.type === selectionPosterTypes.btn){
    listItemHeight = 120
  }
  return {
    ...data, type,
    decoration: {
      right: type===selectionPosterTypes.btn?20:0,
      top: type===selectionPosterTypes.btn?25:0,
    },
    tabStyle: {
      width: sWaterfallWidth - space,
      height: tHeight
    },
    listStyle: {
      width: sWaterfallWidth - space,
      height: listItemHeight
    }
  }
}
export const getSelectionSection = (data:IselectionSection):QTWaterfallSection => {
  const space = data._config?.space || dSectionSpace
  const titleSize = dSectionTitleSize
  const titleBottom = dSectionTitleBottom

  detail2Ui.setSelections(data)
  const firstShowTab = data.tabList[0]||{}
  const firstShowList = firstShowTab.tabList?firstShowTab.tabList[0]:firstShowTab
  const tabStyle = {width: sWaterfallWidth - space, height: 60}
  const sectionheight = tabStyle.height + (firstShowTab.tabStyle?.height||0) + (firstShowList.listStyle?.height||0)
  return {
    _id: ids.selection+data.id, type: selectionTypes.selection,
    title: data.title,
    titleStyle: {
      width: 1000, height: data.title?titleSize+10:0,
      fontSize: data.title?titleSize:0,
      marginBottom: data.title?titleBottom:0
    },
    decoration: { top: 10, left: space, right: 0, bottom: 30 },
    style: { 
      width: sWaterfallWidth - space,
      height: sectionheight, minHeight: sectionheight//460
    },
    itemList: [],
    tabStyle, tabList: data.tabList,
    firstShowTab: firstShowTab.tabList?firstShowTab:{},
    firstShowList 
  }
}
export const getSelectionMoreSection = (data:IselectionBaseSection):QTWaterfallSection => {
  const space = data._config?.space || dSectionSpace
  const titleSize = dSectionTitleSize
  const titleBottom = dSectionTitleBottom
  return {
    _id: ids.selection+data.id, type: selectionTypes.more,
    title: data.title,
    titleStyle: {
      width: 1000,
      height: data.title?titleSize+10:0,
      fontSize: data.title?titleSize:0,
      marginBottom: data.title?titleBottom:0
    },
    decoration: { top: 0, left: space, right: 0, bottom: 30 },
    style: { width: sWaterfallWidth - space, height: 330, },
    itemList: data.itemList
  }
}

export type TposterType = ReturnType<typeof getSelectionPoster>;

class Detail2Ui {
  private deep1:number = -1;
  private deep2:number = -1;
  private selectionData?: IselectionSection

  /**
   * 缓存选集列表数据
   */
  setSelections(data:IselectionSection){
    this.selectionData = data
  }
  /**
   * 获取指定索引的选集数据
   */
  getSelection(indexs:{deep1:number;deep2:number}){
    if(this.deep1>-1){
      const res1 = this.selectionData?.tabList[this.deep1]
      if(res1 && this.deep2>-1){
        const res2 = res1.tabList?.[this.deep2]
        return res2?.tabList||res2?.itemList
      }
      return res1?.tabList||res1?.itemList
    }
    
    this.deep1 = indexs.deep1??this.deep1
    this.deep2 = indexs.deep2??this.deep2
  }
}
export const detail2Ui = new Detail2Ui()