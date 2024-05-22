import {
  QTTab,
  QTTabItem,
  QTTabItemType
} from "@quicktvui/quicktvui3";
import { ESListViewItemDecoration } from "@extscreen/es3-component";
import {
  buildQTTab,
  buildTabImgItem,
  buildTabTextItem, tabBackgroundUrls, tabDecorationGap,
  tabDecorationGapLeft,
  tabDecorationGapRight,
  tabSectionTitleSize
} from "./TabAdapter";
import TabType from "./tab_type/TabType";
import { Tab } from "./impl/Tab";
import config from "../../config";

/**
 * tab数据转换
 * @param tabs
 */
export function buildTransferTabAdapter(tabs: Array<Tab>): QTTab {
  let length = tabs.length
  let defaultFocusIndex: number = 0

  // 处理"我的"Tab
  if (config.tab.showMineTab) {
    length = tabs.unshift({
      menuCode: '_mine',
      menuName: config.tab.mineTabName,
      menuType: '0'
    })
    defaultFocusIndex++
  }

  const tabItemList: Array<QTTabItem> = []
  tabs.map((tab, index) => {
    if (tab.backgroundImage != null) {
      tabBackgroundUrls.set(tab.menuCode, tab.backgroundImage)
    }
    //设置默认选中tab
    if (tab.defaultHome === '1') {
      defaultFocusIndex = index;
    }
    //设置左右距离边界间距
    const decoration: ESListViewItemDecoration = {
      left: index === 0 ? tabDecorationGapLeft : tabDecorationGap,
      right: index === (length - 1) ? tabDecorationGapRight : 0,
      top: 10
    }
    const tabItem: QTTabItem = buildTabItem(tab, decoration)

    // 处理Tab跳转
    tabItem.item = {
      redirectType: tab.redirectType || '',
      action: tab.action || '',
      innerArgs: tab.innerArgs || ''
    }

    tabItemList.push(tabItem)
  })
  const mTabs: QTTab = buildQTTab(defaultFocusIndex, defaultFocusIndex, tabItemList)
  return mTabs
}

/**
 * 创建tab item
 * @param tab 原始数据
 * @param decoration  tab item 左右间隔
 */
function buildTabItem(tab: Tab, decoration?: ESListViewItemDecoration): QTTabItem {
  const menuType = Number(tab.menuType)
  let tabItem: QTTabItem
  switch (menuType) {
    case TabType.TAB_TEXT_TYPE:
      tabItem = buildTabTextItem(tab, tabSectionTitleSize, QTTabItemType.QT_TAB_ITEM_TYPE_DEFAULT, decoration)
      break;
    case TabType.TAB_IMG_TYPE:
      tabItem = buildTabImgItem(tab, 1, decoration)
      break;
    default:
      tabItem = buildTabTextItem(tab, 44, QTTabItemType.QT_TAB_ITEM_TYPE_DEFAULT, decoration)
      break;
  }
  return tabItem
}

export function getTabBackground(tabId): string {
  return <string>tabBackgroundUrls.get(tabId)
}
