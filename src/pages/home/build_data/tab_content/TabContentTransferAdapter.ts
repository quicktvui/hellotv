import {QTTabPageData, QTWaterfallItem, QTWaterfallSection} from "@quicktvui/quicktvui3";
import {TabContentPlate} from "./impl/TabContentPlate";
import {buildEndSection} from "./page";
import {TabSectionItem} from "./impl/TabSectionItem";
import {
  buildPlateData,
  buildQTTabContent,
  buildSectionData,
  buildSectionItem,
  buildTabContentPlate,
  tabPlateTitleGap,
  tabPlateTitleHeightDefault
} from "./TabContentAdapter";
import {TabContent} from "./impl/TabContent";
import {tabBackgroundUrls} from "../tab/TabAdapter";

/**
 * 转换TabContent
 * @param tabId
 * @param tabContent
 * @param isFirstPage
 */
export function buildTransferTabContentAdapter(tabContent:TabContent,isFirstPage:boolean=false,tabId:string):QTTabPageData{
  tabBackgroundUrls.set(tabId,tabContent.image)
  //定义板块总高度
  let plateHeightSum:number = 0
  //首个板块距离顶部距离
  const firstPlateMarginTop = tabContent.firstPlateMarginTop ?? 0
  //首次获得焦点是否禁止移动
  const disableScrollOnFirstScreen = tabContent.disableScrollOnFirstScreen
  //获取当前导航Tab下Plate原始数据
  const plateSourceData = tabContent.plates
  //创建plateList板块集合列表
  const plateList: Array<QTWaterfallSection> = []
  if (plateSourceData && plateSourceData.length>0){
    plateSourceData.map((plateItem,plateIndex:number)=>{
      //获取板块高度
      let plateHeight:number = buildPlateHeight(plateItem)
      plateHeightSum += plateHeight
      const showPlateName = plateItem.showPlateName === '1'
      //section列表
      const tabSectionList:Array<QTWaterfallItem> = buildSectionList(plateItem)
      const tabPlateData:TabContentPlate = buildPlateData(
        plateItem.id,plateItem.plateName,"",0,0,
        plateHeight,showPlateName,false,plateItem.plateType, tabSectionList,plateItem.isFocusScrollTarget,plateItem.isSwitchCellBg)
      //封装板块
      const plate = buildTabContentPlate(tabPlateData, (plateIndex == 0 && isFirstPage),plateIndex == 0 ? firstPlateMarginTop:0)
      plateList.push(plate)

    })
  }
  //如果是一次性返回的数据 则在这里直接判断添加是否添加结束section
  if (plateHeightSum > 1080){
    const endSection = buildEndSection('5');
    plateList.push(endSection)
  }
  const tabPage: QTTabPageData = buildQTTabContent(disableScrollOnFirstScreen,plateList)
  return tabPage
}

/**
 * 计算板块高度
 * @param plateItem
 */
function buildPlateHeight(plateItem):number{
  let plateHeight:number = plateItem.height
  // 获取展示标题flag
  const showPlateName = plateItem.showPlateName
  if (showPlateName == '1'){//展示
    plateHeight += tabPlateTitleGap+tabPlateTitleHeightDefault// 60:默认文字高度，36：间距
  }
  return plateHeight
}

/**
 * build板块中section列表
 * @param plateItem
 */
function buildSectionList(plateItem):Array<QTWaterfallItem>{
  //获取plate 板块中section格子列表
  const sectionList:Array<any> = plateItem.plateDetails
  let tabSectionList:Array<QTWaterfallItem> = []
  const showPlateName = plateItem.showPlateName === '1'
  sectionList.forEach((item,index:number)=>{
    const qtWaterfallItem:QTWaterfallItem = buildWaterfallItem(item,showPlateName)
    tabSectionList.push(qtWaterfallItem)
  })
  return tabSectionList
}

/**
 * build 板块Section
 * @param sectionItem
 * @param showPlateName
 */
function buildWaterfallItem(sectionItem,showPlateName): QTWaterfallItem {
  const posY = sectionItem.posY + (showPlateName? tabPlateTitleGap :0)
  const itemSection:TabSectionItem = buildSectionData(sectionItem.id,sectionItem.width,sectionItem.height,sectionItem.cellType,sectionItem.posX,posY,sectionItem.playLogoSwitch,sectionItem.poster,sectionItem.posterTitle,sectionItem.posterTitleStyle,sectionItem.nonFocusImage,sectionItem.focusImage,sectionItem.cornerContent,sectionItem.cornerColor,sectionItem.cornerGradient,sectionItem.playData,
    sectionItem.redirectType,sectionItem.action,sectionItem.innerArgs,sectionItem.isBgPlayer,sectionItem.focusScreenImage)
  return buildSectionItem(itemSection)
}
