import { ESListViewItemDecoration } from '@extscreen/es3-component'
import { QTTab, QTTabItem } from '@quicktvui/quicktvui3'
import { NavBar } from './imp-nav-bar'
import NavBarConfig from './nav-bar-config'
import NavBarItemType from './nav-bar-item-type'

class BarsData{
  barsData:QTTab
}
const barsDataManager = new BarsData()
export default barsDataManager

/**
 * build nav bars数据
 * @param tabs
 */
export function buildNavBarAdapter(bars: Array<NavBar>) {
  let length = bars.length
  let defFocusIndex = 0
  if (NavBarConfig.tab.showMineTab && length > 1) {
    length = bars.unshift({
      id: NavBarConfig.tab.id,
      name: NavBarConfig.tab.mineTabName,
      type: '0'
    })
    defFocusIndex++
  }
  const barItemList: Array<QTTabItem> = []
  for (let i = 0; i < length; i++) {
    const bar = bars[i]
    //设置默认选中项
    if (bar.isDefault) {
      defFocusIndex = i
    }
    //设置左右距离边界间距
    const decoration: ESListViewItemDecoration = {
      left: i === 0 ? NavBarConfig.tab.leftGap : NavBarConfig.tab.defaultGap,
      right: i === (length - 1) ? NavBarConfig.tab.rightGap : NavBarConfig.tab.defaultGap,
      top: 10
    }
    const barItem:QTTabItem = buildBarItem(bar,decoration)
    barItemList.push(barItem)
  }

  const mBars:QTTab = buildBars(defFocusIndex,defFocusIndex,barItemList)
  barsDataManager.barsData = mBars
  return mBars
}

/**
 * 封装bar数据
 * @param bar
 * @param decoration
 */
export function buildBarItem(bar: NavBar, decoration?: ESListViewItemDecoration): QTTabItem {
  const type = Number(bar.type)
  let barItem: QTTabItem
  switch (type) {
    case NavBarItemType.BAR_TEXT_TYPE: // 文字类型
      barItem = buildBarTextItem(bar, decoration)
      break
    case NavBarItemType.BAR_IMG_TYPE: //图片类型
      barItem = buildBarImgItem(bar, decoration)
      break
    default:// 默认返回 文字类型
      barItem = buildBarTextItem(bar, decoration)
      break
  }
  return barItem
}

/**
 * 文字类型数据封装
 * @param bar
 * @param decoration
 */
export function buildBarTextItem(bar: NavBar, decoration?: ESListViewItemDecoration): QTTabItem {
  const type = bar?.corner ? NavBarItemType.BAR_CORNER_TYPE : NavBarItemType.BAR_TEXT_TYPE
  const barItem: QTTabItem = {
    _id: bar.id,
    type: type,
    text: bar.name,
    titleSize: NavBarConfig.tab.titleSize,
    corner: bar.corner,
    decoration: decoration
  }
  return barItem
}

/**
 * 图片类型数据封装
 * @param bar
 * @param decoration
 */
export function buildBarImgItem(bar: NavBar, decoration?: ESListViewItemDecoration): QTTabItem {
  const barItem: QTTabItem = {
    _id: bar.id,
    type: NavBarItemType.BAR_IMG_TYPE,
    text:bar.name,
    titleSize:NavBarConfig.tab.titleSize,
    image:bar.image,
    decoration:decoration
  }
  return barItem
}

/**
 * 封装整体bars数据
 * @param defFocusIndex
 * @param defIndex
 * @param bars
 */
export function buildBars(defFocusIndex:number=0,defIndex:number=0,bars:Array<QTTabItem>):QTTab{
  return {
    defaultFocusIndex:defFocusIndex,
    defaultIndex:defIndex,
    itemList:bars
  }
}
