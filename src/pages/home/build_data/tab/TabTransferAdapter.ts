import {
  QTTab,
  QTTabItem,
  QTTabItemType
} from "@quicktvui/quicktvui3";
import {ESListViewItemDecoration} from "@extscreen/es3-component";
import {
  buildQTTab,
  buildTabImgItem,
  buildTabTextItem, tabBackgroundUrls, tabDecorationGap,
  tabDecorationGapLeft,
  tabDecorationGapRight,
  tabSectionTitleSize
} from "./TabAdapter";
import TabType from "./tab_type/TabType";
import {Tab} from "./impl/Tab";

/**
 * tab数据转换
 * @param tabs
 */
export function buildTransferTabAdapter(tabs:Array<Tab>):QTTab{
  const tabItemList: Array<QTTabItem> = []
  let defaultFocusIndex: number = 0
  const length = tabs.length
  tabs.map((tab,index)=>{
    tabBackgroundUrls.set(tab.menuCode,tab.backgroundImage)
    //设置默认选中tab
    if (tab.defaultHome === '1'){
      defaultFocusIndex = index;
    }
    //设置左右距离边界间距
    const decoration: ESListViewItemDecoration = {
      left: index === 0 ? tabDecorationGapLeft : tabDecorationGap,
      right: index === (length-1)?tabDecorationGapRight:0,
      top:10
    }
    const tabItem:QTTabItem = buildTabItem(tab,decoration)
    tabItemList.push(tabItem)
  })
  const mTabs:QTTab = buildQTTab(defaultFocusIndex,defaultFocusIndex,tabItemList)
  return mTabs
}

/**
 * 创建tab item
 * @param tab 原始数据
 * @param decoration  tab item 左右间隔
 */
function buildTabItem(tab:any,decoration?: ESListViewItemDecoration):QTTabItem{
  const menuType = Number(tab.menuType)
  let tabItem:QTTabItem
  switch (menuType) {
    case TabType.TAB_TEXT_TYPE:
      tabItem = buildTabTextItem(tab.menuCode,tab.menuName,tabSectionTitleSize,QTTabItemType.QT_TAB_ITEM_TYPE_DEFAULT,decoration,tab.textIcon,tab.cornerImage,tab.focusCornerImage)
      break;
    case TabType.TAB_IMG_TYPE:
      tabItem = buildTabImgItem(tab.menuCode,1,tab.image,tab.focusImage,tab.selectImage,tab.imageWidth,tab.imageHeight,decoration)
      break;
    default:
      tabItem = buildTabTextItem(tab.menuCode,tab.menuName,44,QTTabItemType.QT_TAB_ITEM_TYPE_DEFAULT,decoration,tab.textIcon,tab.cornerImage,tab.focusCornerImage)
      break;
  }
  return tabItem
}

export function getTabBackground(tabId):string{
  return <string>tabBackgroundUrls.get(tabId)
}
