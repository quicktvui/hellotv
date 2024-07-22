import type {
  QTWaterfallSection, QTWaterfallItem
} from "@quicktvui/quicktvui3";
import { QTWaterfallSectionType, QTWaterfallItemType } from "@quicktvui/quicktvui3";
import type { IselectionPoster, IselectionBaseSection, IselectionSection,ItabListItem } from '../../api/details2/types'
import { tabTypes, posterTypes } from '../../api/details2/types'
import { getPosterConfig } from '../../components/Hposter/configs'

export const D2SelectionsSectionTypes = {
  selection: 1, more: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_LIST
}

const sWaterfallWidth = 1920
const sWaterfallHeight = 470

const dSectionSpace = 96
const dSectionTitleSize = 42
const dSectionTitleBottom = 30

export const getSelectionPoster = (sData:IselectionPoster) => {
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

export const ids = {
  selection: 'selection'
}
export const getSelectionSectionTabs = (data:ItabListItem) => {
  const type = data.type||tabTypes.text
  let right = 0
  if(tabTypes.btn){
    right = 20
  }
  if(tabTypes.smallText){
    right = 40
  }
  return {
    ...data, type,
    decoration: { right }
  }
}
export const getSelectionSection = (data:IselectionSection):QTWaterfallSection => {
  const space = data._config?.space || dSectionSpace
  detail2Ui.selectionSpace = space

  const section = getBlankSection(60, space-20)
  section._id = data.id
  section.listSID = ids.selection+data.id
  section.type = D2SelectionsSectionTypes.selection
  section.itemList = (data.tabList as any)||[]
  section.decoration.top = 10
  section.decoration.bottom = 25

  detail2Ui.tabSid = section.listSID

  return section
}
export const getSelectionMoreSection = (data:IselectionBaseSection):QTWaterfallSection => {
  const space = data._config?.space || dSectionSpace
  const titleSize = dSectionTitleSize
  const titleBottom = dSectionTitleBottom
  return {
    _id: ids.selection+data.id, type: D2SelectionsSectionTypes.more,
    title: data.title,
    titleStyle: {
      width: 1000,
      height: data.title?titleSize+10:0,
      fontSize: data.title?titleSize:0,
      marginBottom: data.title?titleBottom:0
    },
    decoration: { top: 0, left: space, right: 0, bottom: dSectionTitleBottom },
    style: { width: sWaterfallWidth - space, height: 330, },
    itemList: data.itemList
  }
}

export const getBlankSection = (height = 0, space = 0) => {
  return {
    _id: Math.random()+'', type: -1000, title: '',
    titleStyle: { width: 0, height: 0, fontSize: 0, marginBottom: 0 },
    decoration: { top: 0, left: space, right: 0, bottom: 0 },
    style: { width: sWaterfallWidth - space, height, minHeight: height },
    itemList:[],
    listSID: 'listSID'+Math.random()
  }
}

export type TposterType = ReturnType<typeof getSelectionPoster>;
export type TselectionTabType = ReturnType<typeof getSelectionSectionTabs>;

class Detail2Ui {
  
  selectionSpace = 0

  selectTabIndex = 0
  selectTab2Index = 0
  selectTabListIndex = 0

  tabSid = ''
  tab2Sid = ''
  tabListSid = ''

  getTab2(tabItem:ItabListItem){
    const tabs2Section = detail2Ui.getShowTab(tabItem)
    
    let tabs2Item:any = null
    if(tabItem.tabList){
      tabs2Item = tabs2Section.itemList[detail2Ui.selectTab2Index]
    } else {
      tabs2Item = tabItem
    }
    const tab2ContentSection = detail2Ui.getShowTabList(tabs2Item as any)
    return { tabs2Section, tab2ContentSection }
  }

  getShowTab(data:ItabListItem){
    const section = getBlankSection(0, this.selectionSpace)
    section.type = D2SelectionsSectionTypes.selection

    if(data){
      section._id = data.id
      section.listSID = ids.selection+data.id
      let tabItem:ItabListItem|null = null
      if(data.tabList){
        tabItem = data.tabList[0]
        section.itemList = data.tabList as any
      }
      if(tabItem){
        if(tabItem.type === tabTypes.btn){
          section.style.height = 66
          section.style.minHeight = 66
          section.decoration.bottom = 15
        }
        if(tabItem.type === tabTypes.smallText){
          section.style.height = 40
          section.style.minHeight = 40
          section.decoration.bottom = 25
          section.decoration.left = this.selectionSpace-15
        }
      }
    }
    
    this.tab2Sid = section.listSID
    return section
  }
  getShowTabList(data:ItabListItem){
    const section = getBlankSection(0, this.selectionSpace)
    section.type = D2SelectionsSectionTypes.selection

    if(data){
      section._id = data.id
      section.listSID = ids.selection+data.id
      let listItem:TposterType|null = null
      if(data.itemList){
        listItem = data.itemList[0]
        section.itemList = data.itemList as any
      }
      if(listItem){
        if(listItem.type === posterTypes.bigBtn){
          section.style.height = 120
          section.style.minHeight = 120
        } else {
          section.style.height = listItem.style.height
          section.style.minHeight = listItem.style.height
        }
        section.decoration.bottom = dSectionTitleBottom
      }
    }
    
    this.tabListSid = section.listSID
    return section
  }
}
export const detail2Ui = new Detail2Ui()