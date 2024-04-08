import {
  QTTab,
  QTTabItem,
  QTTabItemType,
} from "@quicktvui/quicktvui3";
import {ESListViewItemDecoration} from "@extscreen/es3-component";
import { Tab } from "./impl/Tab"
export const tabDecorationGap = 0
export const tabDecorationGapLeft = 70
export const tabDecorationGapRight = 90
export const tabSectionTitleSize = 44
//导航Tab背景数据集合
export const tabBackgroundUrls:Map<string,string> = new Map<string, string>()
/**
 * build导航文字Tab item
 * @param id id
 * @param type 组件类型
 * @param text 文字类型tab 文字
 * @param titleSize tab 文字大小
 * @param decoration 间距
 * @param textIcon 文字标题icon
 * @param tabCorner tab角标
 * @param tabCornerFocus tab焦点角标
 */
export function buildTabTextItem(tab:Tab,titleSize:number,type?:number,decoration?:ESListViewItemDecoration):QTTabItem{
  const tabItem:QTTabItem = {
    _id:tab.menuCode,
    type: type ? type : QTTabItemType.QT_TAB_ITEM_TYPE_DEFAULT,
    text:tab.menuName,
    titleSize,
    textIcon:tab.textIcon,
    tabCorner:tab.cornerImage,
    tabCornerFocus:tab.focusCornerImage,
    decoration,
    isTabBgShow:false,
  }
  return tabItem
}

/**
 * build 导航图片Tab item
 * @param id id
 * @param type 组件类型
 * @param image normal 图
 * @param focusedImage focus 图
 * @param selectedImage selected 图
 * @param imageWidth 图片宽度
 * @param imageHeight 图片高度
 * @param decoration? 间距
 */
export function buildTabImgItem(tab:Tab, type: number, decoration?: ESListViewItemDecoration | undefined):QTTabItem{
  const tabItem:QTTabItem = {
    _id:tab.menuCode,
    type,//1.自定义图片导航样式；QTTabItemType.QT_TAB_ITEM_TYPE_DEFAULT：默认文字样式
    text:"",
    titleSize:tabSectionTitleSize,
    image:tab.image,
    focusedImage:tab.focusImage,
    selectedImage:tab.selectImage,
    imageStyle: {
      width: tab.imageWidth,
      height: tab.imageHeight
    },
    decoration
  }
  return tabItem
}

/**
 * build导航tab list
 * @param defaultFocusIndex 默认选中tab
 * @param defaultIndex 返回时最后选中的tab
 * @param tabs tab 列表数据
 */
export function buildQTTab(defaultFocusIndex:number=0,defaultIndex:number=0,tabs:Array<QTTabItem>):QTTab{
  return {
    defaultFocusIndex: defaultFocusIndex,
    defaultIndex: defaultIndex,
    itemList: tabs
  }
}
