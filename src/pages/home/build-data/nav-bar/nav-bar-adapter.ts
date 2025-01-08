import { ESListViewItemDecoration } from '@extscreen/es3-component'
import { QTTab, QTTabItem } from '@quicktvui/quicktvui3'
import NavBarConfig from './nav-bar-config'
import { BarType, NavBar } from './nav-bar-imp'
import NavBarItemType from './nav-bar-item-type'

class BarsData {
  barsData: QTTab
  barsBgUrls:Map<string,string> = new Map<string, string>()
}

const barsDataManager = new BarsData()
export default barsDataManager

/**
 * build nav bars数据
 * @param tabs
 */
export function buildNavBarAdapter(bars: Array<NavBar>):QTTab {
  let length = bars.length
  let defFocusIndex = 0
  //添加我的tab
  if (NavBarConfig.tab.showMineTab && length > 1) {
    length = bars.unshift({
      id: NavBarConfig.tab.id,
      name: NavBarConfig.tab.mineTabName,
      type: BarType.TYPE_TEXT
    })
    defFocusIndex++
  }
  const barItemList: Array<QTTabItem> = []
  for (let i = 0; i < length; i++) {
    const bar = bars[i]
    if (i === defFocusIndex){
      barsDataManager.barsBgUrls.set("firstShowBg", bar.id)
    }
    //设置默认选中项
    if (bar.isDefault) {
      defFocusIndex = i
      barsDataManager.barsBgUrls.set("firstShowBg", bar.id)
    }
    //设置左右距离边界间距
    const decoration: ESListViewItemDecoration = {
      left: i === 0 ? NavBarConfig.tab.leftGap : NavBarConfig.tab.defaultGap,
      right: i === (length - 1) ? NavBarConfig.tab.rightGap : NavBarConfig.tab.defaultGap,
      top: 10
    }
    const barItem: QTTabItem = buildBarItem(bar, decoration)
    //添加背景图
    barItem['backgroundImg'] = bar.backgroundImg
    //存储背景图
    if (bar.backgroundImg != null) {
      barsDataManager.barsBgUrls.set(bar.id, bar.backgroundImg)
    }
    //添加跳转数据
    barItem['jumpParams'] = bar.jumpParams
    barItemList.push(barItem)
  }
  const mBars: QTTab = buildBars(defFocusIndex, defFocusIndex, barItemList)
  barsDataManager.barsData = mBars
  return mBars
}

/**
 * 封装bar数据
 * @param bar
 * @param decoration
 */
export function buildBarItem(bar: NavBar, decoration?: ESListViewItemDecoration): QTTabItem {
  const type:BarType =bar.type
  let barItem: QTTabItem
  switch (type) {
    case BarType.TYPE_TEXT: // 文本类型
      barItem = buildBarTextItem(bar, decoration)
      break
    case BarType.TYPE_IMG: //图片类型
      barItem = buildBarImgItem(bar, decoration)
      break
    default:// 默认返回 文本类型
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
    text: bar.name,
    titleSize: NavBarConfig.tab.titleSize,
    image: bar.image,
    decoration: decoration
  }
  return barItem
}

/**
 * 封装整体bars数据
 * @param defFocusIndex
 * @param defIndex
 * @param bars
 */
export function buildBars(defFocusIndex: number = 0, defIndex: number = 0, bars: Array<QTTabItem>): QTTab {
  return {
    defaultFocusIndex: defFocusIndex,
    defaultIndex: defIndex,
    itemList: bars
  }
}
