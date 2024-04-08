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
import { tabDecorationGap } from "./tab_content/TabContentAdapter";

/**
 * 转换瀑布流TAB数据
 * @param sourceData
 */
export function buildO2MTabData(sourceData: Array<any>) {
  const tabs: Array<Tab> = []
  sourceData.forEach(item => {
    switch (item.type_id) {
      case 1: case 2: case 3: case 4:
        break
      default:
        const tab: Tab = {
          menuCode: item.type_id,
          menuName: item.type_name,
          menuType: '0'
        }
        tabs.push(tab)
    }
  })
  return buildTransferTabAdapter(tabs)
}

export function buildO2MTabContentData(sourceData: any, pageNo: number = 1, tabId: string) {
  let tabSections: TabSectionItem[] = []
  let x = tabDecorationGap
  sourceData.list?.map((item, index) => {
    let tabSection = {
      id: item.vod_id,
      posX: index == 0 ? x : x += 270 + 36,
      posY: 0,
      width: 270,
      height: 377,
      cellType: 0,
      isBgPlayer: false,
      poster: item.vod_pic,
      posterTitle: item.vod_name,
      posterTitleStyle: '1',
      posterSubtitle: item.vod_sub,
      floatTitle: '',
      cornerContent: '',
      cornerColor: '',
      cornerGradient: '',
      focusImage: '',
      nonFocusImage: '',
      focusScreenImage: '',
      playLogoSwitch: '0',
      playData: [],
      redirectType: '1',
      action: '',
      innerArgs: getInnerArgs(item.vod_id)
    }
    tabSections.push(tabSection)
  })

  let plates: TabContentSection[] = []
  for (let i = 0; i < tabSections.length / 6; i++) {
    plates.push({
      id: `${i + 1}`,
      plateName: `板块: ${i + 1}`,
      showPlateName: '0',
      plateType: '2',
      plateDetails: tabSections.slice(i * 6, (i + 1) * 6),
      height: 377 + 60,
      isSwitchCellBg: '0',
      timeAxisSwitch: '0',
      isFocusScrollTarget: false
    })
  }

  let tabContent: TabContent = {
    id: tabId,
    firstPlateMarginTop: 0,
    disableScrollOnFirstScreen: false,
    plateCount: sourceData.pagecount,
    plates: plates,
    image: ''
  }

  return buildTransferTabContentAdapter(tabContent, pageNo, tabId)
}

function getInnerArgs(mediaId: number | string) {
  return JSON.stringify({
    params: {
      mediaId: mediaId,
      episodeId: 0,
      episodeIndex: 0,
      startPosition: 0
    },
    url: 'series_view'
  })
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
          url: url
        }
        tabPlays.push(tabPlayItem)
      })
    }
  }

  return tabPlays
}
