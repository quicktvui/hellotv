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
import myHistory from "../components/history";
import { QTTab, QTTabPageData, QTWaterfallSection, QTWaterfallItem } from "@quicktvui/quicktvui3";

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
  tabs.push({
    id: '4k_world',
    menuCode: '4k_world',
    menuName: '4K世界',
    menuType: '0',
  })
  tabs.push({
    id: 'short_video',
    menuCode: 'short_video',
    menuName: '短视频',
    menuType: '0',
    imageWidth: undefined,
    imageHeight: undefined,
    image: undefined,
    selectImage: undefined,
    focusImage: undefined,
    focusCornerImage: undefined,
    cornerImage: undefined,
    defaultHome: undefined,
    backgroundImage: undefined,
    redirectType: undefined,
    action: undefined,
    innerArgs: undefined
  })
  tabs.push({
    id: 'multilevelTab',
    menuCode: 'multilevelTab',
    menuName: '多级Tab',
    menuType: '0',
    imageWidth: undefined,
    imageHeight: undefined,
    image: undefined,
    selectImage: undefined,
    focusImage: undefined,
    focusCornerImage: undefined,
    cornerImage: undefined,
    defaultHome: undefined,
    backgroundImage: undefined,
    redirectType: undefined,
    action: undefined,
    innerArgs: undefined
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
      const cellType: string = getSectionType(sectionItem.detailStyle, sectionItem?.config?.contentType,sectionItem?.config?.contentData)
      if(sectionItem?.config?.contentType === '12' && myHistory.plateIndex==-1){
        myHistory.tabPageIndex = tabPageIndex
        myHistory.plateIndex = plateIndex
        myHistory.sectionIndex = sectionIndex
      }
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
        cornerStyle:sectionItem.config?.cornerStyle ?? "0",
        cornerPosition:sectionItem.config?.cornerPosition??"1",
        cornerContent: sectionItem.config?.cornerContent,
        cornerColor: sectionItem.config?.cornerColor,
        cornerGradient: sectionItem.config?.cornerGradient,
        cornerImage:sectionItem.config?.cornerImage,
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

// build 首页短视频板块数据
export function buildHomeShortVideoAdapter(tabId: string, tabPageIndex?: number): QTTabPageData {
  let section: QTWaterfallSection = {
    _id: 'shortVideo1',
    type: 1009,
    style: {
      width: 1920,
      height: 860,
    },
    tabListStyle: {
      width: 1920,
      height: 60,
      marginTop: 0,
      marginLeft: 0,
      marginBottom: 20,
    },
    listStyle: {
      width: 540,
      height: 780,
      marginLeft: 90
    },
    tabListSID: 'shortVideoTabListSID',
    listSID: 'shortVideoListSID',
    autoSelectTabPosition: 0,
    autofocusTabPosition: -1,
    autofocusListPosition: -1,
    decoration: {
      top: 220,
      left: 0,
    },
    tabList: [
      {type: 10091,title: '推荐', decoration: {left: 90}, name: 'tab_list_section_item'},
      {type: 10091,title: '日历', decoration: {}, name: 'tab_list_section_item'},
      {type: 10091,title: '历史', decoration: {}, name: 'tab_list_section_item'},
      {type: 10091,title: '收藏', decoration: {}, name: 'tab_list_section_item'},
    ],
    itemList: []
  }
  const tabPage: QTTabPageData = {
    useDiff: false,
    isEndPage: true,
    data: [section]
  }
  return tabPage
}

// build 首页多级Tab板块数据
export function buildHomeMultilevelTabAdapter(tabId: string, tabPageIndex?: number): QTTabPageData {
  let section: QTWaterfallSection = {
    _id: 'multilevelTab1',
    type: 1010,
    style: {
      width: 1920,
      height: 860,
    },
    tabListStyle: {
      width: 1920,
      height: 60,
      marginTop: 0,
      marginLeft: 0,
      marginBottom: 20,
    },
    listStyle: {
      width: 1740,
      height: 380,
      marginLeft: 90
    },
    tabListSID: 'multilevelTabSID',
    listSID: 'multilevelTabListSID',
    autoSelectTabPosition: 1,
    autofocusTabPosition: -1,
    autofocusListPosition: -1,
    decoration: {
      top: 230,
      left: 0,
    },
    tabList: [
      {type: 10090,title: '排行榜', decoration: { left: 90 }},
      {type: 10091,title: '动画', decoration: {}, name: 'tab_list_section_item'},
      {type: 10091,title: '游戏', decoration: {}, name: 'tab_list_section_item'},
      {type: 10091,title: '生活', decoration: {}, name: 'tab_list_section_item'},
      {type: 10091,title: '影视', decoration: {}, name: 'tab_list_section_item'},
      {type: 10091,title: '知识', decoration: {}, name: 'tab_list_section_item'},
      {type: 10091,title: '美食', decoration: {}, name: 'tab_list_section_item'}
    ],
    itemList: []
  }
  const tabPage: QTTabPageData = {
    useDiff: false,
    isEndPage: true,
    data: [section]
  }
  return tabPage
}
// build 首页 4K 数据
export function build4KWorldAdapter(tabId: string, tabPageIndex?: number): QTTabPageData {
  //
  //
  //
  //https://cdn.midjourney.com/3008c8fe-8cc8-448e-9c6b-fc579d5d42c0/0_0.png
  //https://cdn.midjourney.com/2d377140-7150-4f29-96d3-305cb71b0bfc/0_2.png
  //https://cdn.midjourney.com/0dbbd04f-0622-4079-a875-09b09e33c4ce/0_0.png
  let section:QTWaterfallSection = {
    _id:'4k_world01',
    type:1020,
    title:"",
    style: {
      width: 1920,
      height: 855,
    },
    decoration:{top:200},
    defaultSelectP:1,
    autoscroll:[10000,253],//[position,offset]
    itemList:[
      { type:1,
        style:{width:1413,height:795},
        decoration:{right:92},
        title:"动物世界",
        titleIcon:"",
        subTitle:"\"这个星球上的邻居\"",
        subTitleShow:true,
        imgBg:"https://i1.hdslb.com/bfs/archive/2556572703c7038308ab678c16d3d092fe884785.jpg",
        url:"",
      },
      { type:1,
        style:{width:1413,height:795},
        decoration:{right:92},
        title:"这里是中国",
        titleIcon:"",
        subTitle:"\"从山川到湖泊，从云海到日落\"",
        subTitleShow:true,
        imgBg:"https://img0.baidu.com/it/u=2788130620,4197126272&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
        url:"",
      },
      { type:1,
        style:{width:1413,height:795},
        decoration:{right:92},
        title:"放松 ｜ 漫步 ｜ 街景",
        titleIcon:"",
        subTitle:"\"与你缓步丈量世界\"",
        subTitleShow:true,
        imgBg:"https://pic.rmb.bdstatic.com/8737b0d6a6ee98305fa140b7e831aa2e.jpeg",
        url:"",
      },
    ],
  }
  const tabPage: QTTabPageData = {
    useDiff:false,
    isEndPage:true,
    data:[section]
  }
  return tabPage
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

function getSectionType(detailStyle, contentType,contentData=''): string {

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
  } else if (contentType === '12') {
    if(contentData=='1'){ return '121' }
    if(contentData=='2'){ return '122' }
    return '0'
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
          // cover: 'http://cdnott.holyblade.com/sxyd/GameHallResource_JSY_SXYD/UpLoadImg/07sy_spc_dt.gif',
          url: url,
          isRequestUrl: false,
          thumbnail: index % 2 == 0 ? item.cover : '',
        }
        tabPlays.push(tabPlayItem)
      })
    }
  }

  return tabPlays
}
