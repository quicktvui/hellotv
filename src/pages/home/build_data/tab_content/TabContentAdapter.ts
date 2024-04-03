import {TabContentPlate} from "./impl/TabContentPlate";
import {
  QTListViewItemDecoration,
  QTWaterfallFlexStyle,
  QTWaterfallItem,
  QTWaterfallSection,
  QTWaterfallSectionType
} from "@quicktvui/quicktvui3";
import {TabContentPlateType} from "./tab_content_type/TabContentPlateType";
import {QTFlexStyleText} from "@quicktvui/quicktvui3/dist/src/core/QTFlexStyleText";
import {TabSectionItemType} from "./tab_content_type/TabSectionItemType";
import {TabSectionItem} from "./impl/TabSectionItem";
import {
  buildTabPageBlankItem,
  buildTabPageCellPlayerItem,
  buildTabPageStateImageItem
} from "./TabContentItemAdapter";
import TabSectionType from "./tab_content_type/TabSectionType";
import {buildPoster} from "./TabContentItemPosterAdapter";


export const tabDecorationGap = 90
export const tabPlateTitleGap = 36
export const tabPlateTitleSize = 50
export const tabPlateTitleHeightDefault = 60
export const tabContentTop = 230
export const tabPlateAllHeight:Map<string,object> = new Map<string, object>()

/**
 * build板块原始数据
 * @param id
 * @param plateName 板块文字标题
 * @param plateImgTitle 板块图片标题
 * @param plateImgTitleWidth 板块图片标题宽
 * @param plateImgTitleHeight 板块图片标题高
 * @param plateHeight 板块高度
 * @param showPlateName 控制板块文字标题显示字段
 * @param showImgPlateName 控制板块图片标题显示字段
 * @param plateType 板块类型
 * @param sectionList 板块中Section集合
 */
export function buildPlateData(id:string, plateName:string, plateImgTitle:string, plateImgTitleWidth:number, plateImgTitleHeight:number, plateHeight:number, showPlateName:boolean, showImgPlateName:boolean, plateType:string, sectionList:Array<any>,isFocusScrollTarget?:boolean,isSwitchCellBg?:string):TabContentPlate{
  const tabContentPlate:TabContentPlate = {
    id,
    plateName,
    plateImgTitle,
    plateImgStyle:{
      width:plateImgTitleWidth,
      height:plateImgTitleHeight
    },
    plateHeight,
    showPlateName,
    showImgPlateName,
    plateType,
    sectionList: sectionList,
    isFocusScrollTarget,
    isSwitchCellBg
  }
  return tabContentPlate
}

/**
 * build板块数据
 * @param tabContentPlate 板块数据
 * @param isFirstPlate 是否第一个板块
 */
export function buildTabContentPlate(tabContentPlate: TabContentPlate, isFirstPlate: boolean = false,firstPlateMarginTop:number): QTWaterfallSection {
  let plate: QTWaterfallSection = {
    _id: tabContentPlate.id,
    type: buildTabContentPlateType(tabContentPlate.plateType),
    title: tabContentPlate.showPlateName?tabContentPlate.plateName:'',
    titleStyle: buildTabContentPlateTitleStyle(tabContentPlate),
    imgTitleStyle:buildTabContentPlateImgTitleStyle(tabContentPlate),
    imgTitle:tabContentPlate.plateImgTitle,
    decoration: buildTabContentPlateDecoration(tabContentPlate, isFirstPlate,firstPlateMarginTop),
    style: buildTabContentPlateStyle(tabContentPlate),
    isFocusScrollTarget:tabContentPlate.isFocusScrollTarget,
    isSwitchCellBg:tabContentPlate.isSwitchCellBg,
    itemList: tabContentPlate.sectionList as Array<QTWaterfallItem>
  }

  switch (plate.type) {
    case QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX://默认
      break
    case QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_LIST://一行滚动
      buildHorizontalListSectionItemList(plate.itemList,tabContentPlate.showPlateName)
      break
    case 999://多级tab
      break
  }
  return plate
}

/**
 * build板块样式
 * @param plateType 板块类型
 */
export function buildTabContentPlateType(plateType:string): number {
  let type: number
  switch (plateType) {
    case TabContentPlateType.TAB_CONTENT_PLATE_TYPE_LIST:
      type = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_LIST
      break;
    case TabContentPlateType.TAB_CONTENT_PLATE_TYPE_MULTI:
      type = 999
      break
    default:
      type = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX
      break
  }
  return type
}

/**
 * build 板块文字标题 css 暂时只支持尺寸 间距
 * @param tabContentPlate
 */
function buildTabContentPlateTitleStyle(tabContentPlate: TabContentPlate): QTWaterfallFlexStyle & QTFlexStyleText {
  let titleStyle: QTWaterfallFlexStyle & QTFlexStyleText
  if (tabContentPlate.showPlateName) {
    titleStyle = {
      marginLeft: tabDecorationGap,
      fontSize:tabPlateTitleSize
    }
  }
  else {
    titleStyle = {
      width: 0,
      height: 0,
    }
  }
  return titleStyle
}

/**
 * build 板块图片标题css 暂时只支持尺寸 间距
 * @param tabContentPlate
 */
function buildTabContentPlateImgTitleStyle(tabContentPlate: TabContentPlate): QTWaterfallFlexStyle & QTFlexStyleText {
  let imgTitleStyle: QTWaterfallFlexStyle & QTFlexStyleText
  if (tabContentPlate.showImgPlateName) {
    if ("width" in tabContentPlate.plateImgStyle
      && "height" in tabContentPlate.plateImgStyle) {
      imgTitleStyle = {
        marginLeft: tabDecorationGap,
        width: tabContentPlate.plateImgStyle.width,
        height: tabContentPlate.plateImgStyle.height
      }
    }
  }
  else {
    imgTitleStyle = {
      width: 0,
      height: 0,
    }
  }
  return imgTitleStyle
}
/**
 * build 板块上下左右间距
 * @param tabContentPlate
 * @param isFirstSection
 */
function buildTabContentPlateDecoration(tabContentPlate: TabContentPlate, isFirstSection: boolean,firstPlateMarginTop:number): QTListViewItemDecoration {
  let decoration: QTListViewItemDecoration
  if (isFirstSection) {
    decoration = {
      top: tabContentTop+firstPlateMarginTop,
    }
  }else{
    decoration = {
      top: tabPlateTitleGap,
    }
  }
  return decoration
}

/**
 * build 板块css  暂时只支持尺寸 间距
 * @param tabContentPlate
 */
function buildTabContentPlateStyle(tabContentPlate: TabContentPlate): QTWaterfallFlexStyle {
  let style: QTWaterfallFlexStyle = {
    width: 1920,
    height: tabContentPlate.plateHeight,
  }
  return style
}

/**
 *  build Section
 * @param id id
 * @param sectionWidth section 宽
 * @param sectionHeight section 高
 * @param cellType section 类型 @line
 * @param posX
 * @param posY
 * @param playLogoSwitch
 * @param poster
 * @param posterTitle
 * @param posterTitleStyle?
 * @param nonFocusImage?
 * @param focusImage?
 * @param cornerContent?
 * @param cornerColor?
 * @param cornerGradient?
 * @param playData?
 * @param redirectType?
 * @param action?
 * @param innerArgs?
 * @param isBgPlayer
 * @param focusScreenImage
 */
export function buildSectionData(id: string, sectionWidth: number, sectionHeight: number,
                                 cellType: string = TabSectionItemType.TAB_CONTENT_ITEM_DEFAULT, posX: number, posY: number, playLogoSwitch: string = '0', poster: string, posterTitle: string, posterTitleStyle?: string, nonFocusImage?: string, focusImage?: string, cornerContent?: string, cornerColor?: string, cornerGradient?: string, playData?: Array<any>,
                                 redirectType?: string, action?: string, innerArgs?: string, isBgPlayer?: boolean, focusScreenImage?: string):TabSectionItem{
  return {
    id,
    width:sectionWidth,
    height:sectionHeight,
    poster,
    posterTitle,
    cellType,
    posX,
    posY,
    posterTitleStyle,
    playLogoSwitch,
    nonFocusImage,
    focusImage,
    cornerContent,
    cornerColor,
    cornerGradient,
    playData,
    redirectType,
    action,
    innerArgs,
    isBgPlayer,
    focusScreenImage
  }
}

export function buildSectionItem(itemSection:TabSectionItem):QTWaterfallItem{
  let item: QTWaterfallItem
  switch (itemSection.cellType) {
    case TabSectionItemType.TAB_CONTENT_ITEM_FOCUS_CHANGE_IMG://焦点变图格子
      item = buildTabPageStateImageItem(itemSection,itemSection.cellType)
      item.type = TabSectionType.TYPE_ITEM_SECTION_FOCUS_CHANGE_IMG
      break;
    case TabSectionItemType.TAB_CONTENT_ITEM_NO_FRAME://无边框格子
      item = buildTabPageStateImageItem(itemSection,itemSection.cellType)
      item.type = TabSectionType.TYPE_ITEM_SECTION_NO_FRAME
      break;
    case TabSectionItemType.TAB_CONTENT_ITEM_PLACE_HOLDER://占位格子
      item = buildTabPageBlankItem(itemSection)
      item.type = TabSectionType.TYPE_ITEM_SECTION_PLACE_HOLDER
      break;
    case TabSectionItemType.TAB_CONTENT_ITEM_CELL_PLAYER://小窗格子
      item = buildTabPageCellPlayerItem(itemSection)
      item.type = TabSectionType.TYPE_ITEM_SECTION_CELL_PLAYER
      break;
    case TabSectionItemType.TAB_CONTENT_ITEM_CELL_PLAYER_LIST://小窗列表格子
      item = buildTabPageCellPlayerItem(itemSection)
      item.type = TabSectionType.TYPE_ITEM_SECTION_CELL_PLAYER
      break;
    default :
      item = buildPoster(itemSection)
      break;
  }
  return item
}



/**
 * build瀑布流Tab Content内容
 * @param useDiff
 * @param disableScrollOnFirstScreen
 * @param plateList
 */
export function buildQTTabContent( disableScrollOnFirstScreen:boolean=false, plateList:Array<QTWaterfallSection>){
  return {
    useDiff:false,
    disableScrollOnFirstScreen,
    data: plateList
  }
}

//------------------------------------------横向滚动列表--------------------------------------------
function buildHorizontalListSectionItemList(itemList: Array<QTWaterfallItem>,showPlateName:boolean=false): void {
  const top = showPlateName ? tabPlateTitleGap : 0
  if (itemList.length === 1) {
    itemList[0].decoration = {
      left: tabDecorationGap,
      right: 0,
      top: top
    }
    return
  }
  for (let i = 0; i < (itemList.length - 1); i++) {
    const item: QTWaterfallItem = itemList[i]
    const nextItem: QTWaterfallItem = itemList[i + 1]
    let rightDecoration = (nextItem.style.x ?? 0) - (item.style.width ?? 0) - (item.style.x ?? 0)
    if (i == 0) {
      if (item.decoration) {
        item.decoration.left = tabDecorationGap
        item.decoration.right = rightDecoration
        item.decoration.top = top
      } else {
        item.decoration = {
          left: tabDecorationGap,
          right: rightDecoration,
          top : top
        }
      }
    } else {
      if (item.decoration) {
        item.decoration.right = rightDecoration
        item.decoration.top = top
      } else {
        item.decoration = {
          right: rightDecoration,
          top:top
        }
      }
      if (i === (itemList.length - 2)){
        nextItem.decoration = {
          right:tabDecorationGap,
          top:top,
        }
      }
    }
  }
}
