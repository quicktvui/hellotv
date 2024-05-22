import { Tab } from "./tab/impl/Tab";
import { buildTransferTabAdapter } from "./tab/TabTransferAdapter";
import { TabContent } from "./tab_content/impl/TabContent";
import { TabContentLabel } from "./tab_content/impl/TabContentLabel"
import { TabContentSection } from "./tab_content/impl/TabContentSection";
import {
  buildTransferTabContentAdapter,
  getPosLabel
} from "./tab_content/TabContentTransferAdapter"
import { TabSectionItem } from "./tab_content/impl/TabSectionItem";
import { TabPlayItem } from "./tab_content/impl/TabPlayItem";

/**
 * 转换瀑布流TAB数据
 * @param sourceData
 */
export function buildO2MTabData(sourceData: Array<any>) {
  const tabs: Array<Tab> = []
  sourceData.forEach((item, index) => {
    const tab: Tab = {
      id: item.id,
      menuCode: item.menuCode,
      menuName: item.menuName,
      menuType: item.menuType,
      imageWidth: item.imageWidth,
      imageHeight: item.imageHeight,
      image: item.image,
      selectImage: item.currentImage,
      focusImage: item.focusImage,
      focusCornerImage: item.focusCornerImage,
      cornerImage: item.cornerImage,
      defaultHome: item.defaultHome,
      backgroundImage: item.backgroundImage,
      redirectType: item.actionRedirect?.redirectType,
      action: item.actionRedirect?.action,
      innerArgs: item.actionRedirect?.innerArgs
    }
    tabs.push(tab)
  })
  return buildTransferTabAdapter(tabs)
}

export function buildO2MTabContentData(sourceData: any, pageNo: number = 1, tabId: string, tabPageIndex?: number) {
  const { firstPlateMarginTop, disableScrollOnFirstScreen } = getParameter(sourceData.parameter)
  const plates: Array<TabContentSection> = []
  sourceData.plates?.forEach((plateItem, plateIndex) => {
    let plateType: string = '1'
    switch (plateItem.plateType) {
      //一行滚动
      case "2":
      case "3":
        plateType = '2'
        break;
      default:
        //普通板块类型
        plateType = '1'
        break
    }

    const tabSections: Array<TabSectionItem> = []
    let isFocusScrollTarget: boolean = false
    let isFirst: boolean = true
    let isSwitchCellBg: string = '0'
    plateItem.plateDetails?.forEach((sectionItem, sectionIndex) => {
      const cellType: string = getSectionType(sectionItem.detailStyle, sectionItem?.config?.contentType)
      if ((cellType === '10008' || cellType === '10009') && isFirst) {
        isFocusScrollTarget = true
        isFirst = false
      }
      if (plateIndex === 0) {
        isSwitchCellBg = !!sectionItem.config?.focusScreenImage ? '1' : '0'
      }
      const playData: Array<TabPlayItem> = getPlayData(sectionItem.config?.community?.videoAssets, sectionItem.config)
      let tabSectionItem: TabSectionItem = {
        id: sectionItem.id,
        posX: sectionItem.posX,
        posY: sectionItem.posY,
        width: sectionItem.width,
        height: sectionItem.height,
        cellType: cellType,
        isBgPlayer: !!sectionItem.config?.focusScreenAssetId,
        poster: sectionItem.config?.poster,
        posterTitle: sectionItem.config?.posterTitle,
        posterTitleStyle: sectionItem.config?.posterTitleStyle,
        posterSubtitle: sectionItem.config?.posterSubtitle,
        floatTitle: sectionItem.config?.floatTitle,
        cornerContent: sectionItem.config?.cornerContent,
        cornerColor: sectionItem.config?.cornerColor,
        cornerGradient: sectionItem.config?.cornerGradient,
        focusImage: sectionItem.config?.focusImage,
        nonFocusImage: sectionItem.config?.nonFocusImage,
        focusScreenImage: sectionItem.config?.focusScreenImage,
        playLogoSwitch: sectionItem.config?.playLogoSwitch,
        playData: playData,
        redirectType: sectionItem.config?.redirectType,
        action: sectionItem.config?.action,
        innerArgs: sectionItem.config?.innerArgs
      }
      tabSections.push(tabSectionItem)
    })

    const tabContentSection: TabContentSection = {
      id: plateItem.id,
      plateName: plateItem.plateName,
      showPlateName: plateItem.showPlateName,
      plateType: plateType,
      plateDetails: tabSections,
      height: plateItem.height,
      isSwitchCellBg: isSwitchCellBg,
      timeAxisSwitch: plateItem.timeAxisSwitch,
      isFocusScrollTarget: isFocusScrollTarget
    }
    plates.push(tabContentSection)
  })

  let tabContent: TabContent = {
    id: sourceData.id,
    firstPlateMarginTop: firstPlateMarginTop,
    disableScrollOnFirstScreen: disableScrollOnFirstScreen,
    plateCount: sourceData.plateCount,
    plates: plates,
    image: sourceData.image
  }
  return buildTransferTabContentAdapter(tabContent, pageNo, tabId, tabPageIndex)
}

export function getSectionPosLabelObject(sectionPosLabel: string): TabContentLabel {
  return getPosLabel(sectionPosLabel)
}

function getParameter(parameter) {
  let params = {
    firstPlateMarginTop: 0,
    disableScrollOnFirstScreen: false
  }
  if (parameter) {
    const param = JSON.parse(parameter)
    for (let j = 0; j < param.length; j++) {
      const key = param[j].key
      switch (key) {
        case "switchBgMarginTop":
          if (param[j].value) {
            const value = Number(param[j].value);
            if (value) {
              params.firstPlateMarginTop += value;
            }
          }
          break;
        case "disableScrollOnFirstScreen":
          if (param[j].value) {
            params.disableScrollOnFirstScreen = param[j].value === 'true'
          }
          break;
      }
    }
  }
  return params
}

function getSectionType(detailStyle, contentType): string {

  if (detailStyle === '1') {
    return '1'
  } else if (detailStyle === '2') {
    return '3'
  } else if (detailStyle === '3') {
    return '2'
  } else if (contentType === '17') {
    return '10008'
  } else if (contentType === '13') {
    return '10009'
  } else {
    return '0'
  }
}

function getPlayData(videoAssets, config): Array<TabPlayItem> {
  const tabPlays: Array<TabPlayItem> = []
  if (config?.focusScreenAssetId) {
    const tabPlayItem: TabPlayItem = {
      id: config?.focusScreenAssetId,
      title: config?.focusScreenAssetName,
      cover: config?.focusScreenImage,
      url: "",
      isRequestUrl: true
    }
    tabPlays.push(tabPlayItem)
  } else {
    if (videoAssets && videoAssets.length > 0) {
      videoAssets.forEach((item, index) => {
        const mediaList = item.mediaList
        const url = (mediaList && mediaList.length > 0) ? mediaList[0]?.filepath : ""
        const tabPlayItem: TabPlayItem = {
          id: item.id,
          title: item.assetName,
          cover: item.cover,
          url: url,
          isRequestUrl: false,
          thumbnail: index % 2 == 0 ? item.cover : 0,
        }
        tabPlays.push(tabPlayItem)
      })
    }
  }

  return tabPlays
}
