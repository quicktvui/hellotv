import { QTFlexStyleText, QTTabPageData, QTWaterfallItem, QTWaterfallSection, QTWaterfallSectionType } from '@quicktvui/quicktvui3'
import { QTListViewItemDecoration } from '@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItemDecoration'
import { QTWaterfallFlexStyle } from '@quicktvui/quicktvui3/dist/src/waterfall/core/QTWaterfallFlexStyle'
import homeManager from '../../api'
import ThemeConfig from '../../../../config/theme-config'
import { CellListItemType, HomePlayType } from '../media/home-media-imp'
import barsDataManager from '../tab-bar/tab-bar-adapter'
import TabContentConfig from './tab-content-config'
import { PlayType, Section, Section4KItem, SectionItem, SectionItemType, SectionType, TabContent } from './tab-content-imp'
import TabContentItemType from './tab-content-item-type'

class TabsContent {
  //存储板块高度
  sectionTotalHeight: Map<string, number> = new Map<string, number>()
  //存储二屏图
  tab2BackgroundUrls: Map<string, string> = new Map<string, string>()
  // 首页4k列表,短视频第一页数据
  homeSectionCacheList: Map<string, Array<any>> = new Map<string, Array<any>>()
  // 记录历史格子位置 {tanIndex: 1, itemIndex: 1}
  historyItemPos: Array<any> = []
}

const tabsContent = new TabsContent()
export default tabsContent

/**
 * build导航下对应内容
 * @param tabContent 接口数据
 * @param pageNo 当前页数
 * @param tabId 导航 ID
 * @param tabPageIndex 导航 index
 */
export async function buildTabContentAdapter(
  tabContent: TabContent,
  pageNo: number = 1,
  tabId: string,
  tabPageIndex: number
): Promise<QTTabPageData> {
  const isFirstPage = pageNo === 1
  //首次加载清除当前板块高度
  if (isFirstPage) {
    tabsContent.sectionTotalHeight.delete(tabId)
  }
  //解析自定义参数
  const { firstSectionMarginTop, content4kId, shortVideoId, disableScrollOnFirstScreen } = parseParameter(tabContent.customParams)
  //4K 视频
  if (content4kId && pageNo === 1) {
    return build4kTabPage(content4kId, tabPageIndex)
  } else if (shortVideoId && pageNo === 1) {
    return buildShortTabPage(shortVideoId, tabPageIndex)
  }
  if (!tabContent || !tabContent.sections || tabContent.sections.length === 0) {
    return {
      data: [],
      isLoadPageEnd: true
    }
  }
  //存储二屏图
  if (tabContent.backgroundImage != null) {
    tabsContent.tab2BackgroundUrls.set(tabId, tabContent.backgroundImage)
  }
  //获取当前导航Tab下Section原始数据
  const sectionSourceData: Array<Section> = tabContent.sections
  //创建sectionList板块集合列表
  const sectionList: Array<QTWaterfallSection> = []
  if (sectionSourceData && sectionSourceData.length > 0) {
    for (let sectionIndex = 0; sectionIndex < sectionSourceData.length; sectionIndex++) {
      const section: Section = sectionSourceData[sectionIndex]
      //如果是图片标题 板块标题高度从后台获取
      if (section.title?.image && section.title?.style?.height && section.title?.style?.width) {
        TabContentConfig.sectionTitleHeightDefault = section.title.style.height
      }
      //检测小 4K 放映厅 板块 是否存在 单独处理
      const sectionType = section.type
      if (sectionType === SectionType.TYPE_SWIPER_PLAY) {
        section.style['height'] = 484
      }

      //获取板块高度
      const sectionHeight: number = getSectionHeight(section)
      //存储板块高度 用于判断是否展示底部提示
      saveSectionTotalHeight(sectionHeight, tabId)
      const firstSectionIndex: boolean = sectionIndex === 0 && isFirstPage
      if (sectionType === SectionType.TYPE_SWIPER_PLAY && section.contentId) {
        //获取展示的板块高度
        section.style.height = buildSectionHeightBySectionType(section)
        const buildSectionData: QTWaterfallSection = await buildSmall4KSection(
          section,
          tabPageIndex,
          sectionIndex,
          firstSectionIndex,
          firstSectionMarginTop
        )
        sectionList.push(buildSectionData)
      } else {
        // build section列表数据
        const res = buildSectionItemList(section, sectionIndex, tabPageIndex, pageNo)
        const sectionWaterfallItemList: Array<QTWaterfallItem> = res.buildSectionItemList
        const isFocusScrollTarget: boolean = res.isFocusScrollTarget
        //获取展示的板块高度
        section.style.height = buildSectionHeightBySectionType(section)
        //build 板块数据
        const buildSectionData: QTWaterfallSection = buildSection(
          section,
          sectionWaterfallItemList,
          firstSectionIndex,
          firstSectionMarginTop,
          isFocusScrollTarget
        )
        sectionList.push(buildSectionData)
      }
    }
  }
  /********根据板块高度，分页是否结束数据判断是否加载结束板块***********/
  //加载结束标识
  let isLoadPageEnd: boolean
  //当前已经加载的板块个数
  const curLoadTotal = (pageNo - 1) * TabContentConfig.sectionLoadLimit + sectionSourceData?.length
  //当前板块总高度
  const singleNavBarOffsetY = barsDataManager.barsData.itemList?.length > 1 ? 0 : TabContentConfig.firstSectionOffsetY
  const sectionTotalHeight = getSectionTotalHeight(tabId) + firstSectionMarginTop + TabContentConfig.firstSectionTop + singleNavBarOffsetY
  if (sectionTotalHeight > 1080 && curLoadTotal >= (tabContent.total || 0)) {
    isLoadPageEnd = true

    // 如果最后一个板块格子标题在外部, 到底提示板块增加上边距
    if (sectionList[sectionList.length - 1].itemList[0].title?.type === SectionItemType.TYPE_OUT) {
      sectionList.push(buildEndSection('5', { top: 40 }))
    } else {
      sectionList.push(buildEndSection('5'))
    }
  } else {
    isLoadPageEnd = sectionList.length === 0
  }
  const tabPage: QTTabPageData = buildTabContent(disableScrollOnFirstScreen, sectionList)
  tabPage.isLoadPageEnd = isLoadPageEnd
  return tabPage
}

/**
 * 根据板块类型 build 板块展示高度
 * @param section type：SectionType.TYPE_DEFAULT / SectionType.TYPE_LINE_SCROLL
 */
export function buildSectionHeightBySectionType(section: Section): number {
  const sectionType = section.type
  let height: number = getSectionHeight(section)
  if (sectionType === SectionType.TYPE_DEFAULT) {
    //默认flex布局的板块 会自动计算板块标题高度所以此处减掉板块标题高度
    height = section.showTitle ? height - TabContentConfig.sectionTitleHeightDefault : height
  }
  return height
}

/**
 * 获取板块高度
 * @param section
 */
export function getSectionHeight(section: Section): number {
  let sectionHeight: number = section.style?.height || 0
  //获取是否展示板块标题 flag
  const showTitle = section.showTitle
  if (showTitle) {
    if (section.type === SectionType.TYPE_SWIPER_PLAY) {
      //放映厅板块 需要展示标题的时候，不加间距高度
      sectionHeight += TabContentConfig.sectionTitleHeightDefault
    } else {
      sectionHeight += TabContentConfig.sectionGap + TabContentConfig.sectionTitleHeightDefault
    }
  }
  return sectionHeight
}

/**
 * 存储板块整体高度
 * @param sectionHeight 已有板块高度
 * @param tabId 导航 ID
 */
export function saveSectionTotalHeight(sectionHeight: number, tabId: string): void {
  const sectionHeightOld = tabsContent.sectionTotalHeight.get(tabId) || 0
  const totalH = sectionHeightOld + sectionHeight
  tabsContent.sectionTotalHeight.set(tabId, totalH)
}

/**
 * 获取板块总高度
 * @param tabId
 */
export function getSectionTotalHeight(tabId: string): number {
  return tabsContent.sectionTotalHeight.get(tabId) || 0
}

/**
 * 解析自定义参数
 * @param parameter
 */
export function parseParameter(parameter) {
  const params = {
    //首个板块距离顶部距离
    firstSectionMarginTop: 0,
    //首次获得焦点是否禁止移动
    disableScrollOnFirstScreen: false,
    //4k内容Id
    content4kId: '',
    //短视频内容Id
    shortVideoId: '',
    //预约内容Id
    reservationId: ''
  }
  if (parameter) {
    const param = JSON.parse(parameter)
    for (let j = 0; j < param.length; j++) {
      const key = param[j].key
      switch (key) {
        case 'switchBgMarginTop':
          if (param[j].value) {
            const value = Number(param[j].value)
            if (value) {
              params.firstSectionMarginTop += value
            }
          }
          break
        case 'disableScrollOnFirstScreen':
          if (param[j].value) {
            params.disableScrollOnFirstScreen = param[j].value === 'true'
          }
          break
        case 'content4kId':
          if (param[j].value) {
            params.content4kId = param[j].value
          }
          break
        case 'shortVideoId':
          if (param[j].value) {
            params.shortVideoId = param[j].value
          }
          break
        default:
          if (param[j].value) {
            params[key] = param[j].value
          }
          break
      }
    }
  }
  return params
}

/**
 * 封装板块数据
 * @param section 板块数据
 * @param sectionIndex 板块 index
 * @param tabPageIndex 导航 index
 */
export function buildSectionItemList(
  section: Section,
  sectionIndex: number,
  tabPageIndex: number,
  pageNo: number
): { buildSectionItemList: Array<QTWaterfallItem>; isFocusScrollTarget: boolean } {
  //定义封装后的数据
  const buildSectionItemList: Array<QTWaterfallItem> = []
  let isFocusScrollTarget: boolean = false
  //获取板块内容列表
  const sectionItemList: Array<SectionItem> = section.items
  if (sectionItemList && sectionItemList.length > 0) {
    const length = sectionItemList.length
    //板块类型
    const type = section.type
    //是否展示板块标题
    const showTitle = section.showTitle
    let isFirstSetPlay: boolean = true
    for (const sectionItem of sectionItemList) {
      const sectionItemIndex: number = sectionItemList.indexOf(sectionItem)
      //封装格子数据
      const qtWaterfallItem: QTWaterfallItem = buildSectionItem(sectionItem, showTitle, tabPageIndex, type, sectionItemIndex)
      //针对一行滚动格子设置decoration
      if (type === SectionType.TYPE_LINE_SCROLL) {
        qtWaterfallItem.decoration = {
          left: sectionItemIndex === 0 ? TabContentConfig.decorationLeftGap : TabContentConfig.sectionItemGap,
          right: sectionItemIndex === length - 1 ? TabContentConfig.decorationLeftGap : 0,
          top: section.showTitle ? TabContentConfig.sectionItemGap : 0
        }
      }
      if (sectionIndex === 0 && pageNo === 1) {
        //检测第一个板块中是否有播放器
        const sectionItemType = sectionItem.type
        if (
          (sectionItemType === SectionItemType.TYPE_SMALL_PLAY || sectionItemType === SectionItemType.TYPE_SMALL_LIST_PLAY) &&
          isFirstSetPlay
        ) {
          isFirstSetPlay = false
          isFocusScrollTarget = true
          //保存小窗播放/小窗播放列表数据
          barsDataManager.barsData.itemList[tabPageIndex].isPlay = true
          const playType = sectionItemType === SectionItemType.TYPE_SMALL_PLAY ? HomePlayType.TYPE_CELL : HomePlayType.TYPE_CELL_LIST
          barsDataManager.barsData.itemList[tabPageIndex].playType = playType
          barsDataManager.barsData.itemList[tabPageIndex].sectionItemIndex = sectionItemIndex
        } else if (sectionItem.playBackgroundId) {
          //背景播放
          if (isFirstSetPlay) {
            isFirstSetPlay = false
            barsDataManager.barsData.itemList[tabPageIndex].isPlay = true
            barsDataManager.barsData.itemList[tabPageIndex].playType = HomePlayType.TYPE_BG
            barsDataManager.barsData.itemList[tabPageIndex].sectionItemIndex = sectionItemIndex
          }
          const playBackgroundUrl = sectionItem.playBackgroundUrl
          const play = {
            playData: [
              {
                id: sectionItem.playBackgroundId,
                index: sectionItemIndex,
                type: PlayType.TYPE_LONG,
                cover: sectionItem.imageFocusBackground,
                isRequestUrl: !playBackgroundUrl,
                url: playBackgroundUrl
                  ? [
                      {
                        definition: '1',
                        playUrl: playBackgroundUrl
                      }
                    ]
                  : []
              }
            ]
          }
          qtWaterfallItem.play = play
        }
      }
      buildSectionItemList.push(qtWaterfallItem)
    }
  }
  return {
    buildSectionItemList: buildSectionItemList,
    isFocusScrollTarget: isFocusScrollTarget
  }
}

/**
 * 封装格子数据
 * @param sectionItem
 * @param showTitle
 * @param tabPageIndex
 * @param sectionType
 */
export function buildSectionItem(
  sectionItem: SectionItem,
  showTitle: boolean,
  tabPageIndex: number,
  sectionType: number | string,
  sectionItemIndex?: number
): QTWaterfallItem {
  //根据是否展示板块标题和是否是一行滚动
  const posY = sectionItem.posY + (showTitle ? TabContentConfig.sectionItemGap : 0)
  if (sectionType === SectionType.TYPE_LINE_SCROLL) {
    sectionItem.posY = 0
  } else {
    sectionItem.posY = posY
  }
  let buildSectionItem: QTWaterfallItem
  let historyItemFlag = false
  const sectionItemType: SectionItemType = sectionItem.type
  switch (sectionItemType) {
    case SectionItemType.TYPE_DEFAULT: //无标题
      buildSectionItem = buildNoTitleSectionItem(sectionItem)
      break
    case SectionItemType.TYPE_INNER:
    case SectionItemType.TYPE_OUT: //带标题
      buildSectionItem = buildTitleSectionItem(sectionItem)
      break
    case SectionItemType.TYPE_PLACE_HOLDER: //占位格子
      buildSectionItem = buildPlaceHolderSectionItem(sectionItem)
      break
    case SectionItemType.TYPE_TEXT_HISTORY://文字历史格子
    case SectionItemType.TYPE_IMG_HISTORY://图片历史格子
      buildSectionItem = buildTextHistorySectionItem(sectionItem)
      // 记录历史格子的位置
      tabsContent.historyItemPos.map((item) => {
        if (item.tabIndex == tabPageIndex) historyItemFlag = true
      })
      if (!historyItemFlag) tabsContent.historyItemPos.push({ tabIndex: tabPageIndex, itemIndex: sectionItemIndex })
      break
    case SectionItemType.TYPE_FOCUS_CHANGE_IMG: //焦点换图格子
      buildSectionItem = buildFocusChangeImgSectionItem(sectionItem)
      break
    case SectionItemType.TYPE_SMALL_PLAY: //小窗播放
      buildSectionItem = buildSmallPlayerSectionItem(sectionItem, tabPageIndex)
      break
    case SectionItemType.TYPE_SMALL_LIST_PLAY: // 小窗列表播放
      buildSectionItem = buildSmallListPlayerSectionItem(sectionItem, tabPageIndex)
      break
    default: //默认--无标题格子
      buildSectionItem = buildNoTitleSectionItem(sectionItem)
      break
  }
  return buildSectionItem
}

/**
 * 封装无标题格子
 * @param sectionItem 格子数据
 */
export function buildNoTitleSectionItem(sectionItem: SectionItem): QTWaterfallItem {
  return {
    type: TabContentItemType.TYPE_ITEM_SECTION_NO_TITLE,
    style: buildStyle(sectionItem),
    image: {
      style: {
        width: sectionItem.width,
        height: sectionItem.height
      },
      normal: sectionItem.image
    },
    corner: buildCorner(sectionItem),
    imageFocusBackground: sectionItem.imageFocusBackground,
    jumpParams: sectionItem.jumpParams,
    shimmer: {
      enable: true,
      size: [sectionItem.width, sectionItem.height]
    }
  }
}

/**
 * 封装带题格子
 * @param sectionItem 格子数据
 */
export function buildTitleSectionItem(sectionItem: SectionItem): QTWaterfallItem {
  const style = buildStyle(sectionItem)
  const type = sectionItem.type
  let height = sectionItem.height
  let colors = ['#00000000', '#00000000']
  if (type === SectionItemType.TYPE_OUT) {
    height += TabContentConfig.sectionItemHeight
  } else {
    colors = ThemeConfig.tabContentFloatBgColor
  }
  style.height = height
  return {
    type: TabContentItemType.TYPE_ITEM_SECTION_HAS_TITLE,
    style: style,
    image: {
      style: {
        width: sectionItem.width,
        height: sectionItem.height
      },
      normal: sectionItem.image
    },
    title: {
      type,
      style: {
        width: sectionItem.width,
        height: TabContentConfig.sectionItemHeight,
        marginTop: height - TabContentConfig.sectionItemHeight
      },
      text: sectionItem.title,
      background: {
        colors: colors,
        cornerRadii4: [0, 0, ThemeConfig.focusBorderCorner, ThemeConfig.focusBorderCorner],
        orientation: 4
      }
    },
    corner: buildCorner(sectionItem),
    shimmer: {
      enable: true,
      size: [sectionItem.width, sectionItem.height]
    },
    jumpParams: sectionItem.jumpParams
  }
}

/**
 * 封装焦点变图格子
 * @param sectionItem 格子数据
 */
export function buildFocusChangeImgSectionItem(sectionItem: SectionItem): QTWaterfallItem {
  return {
    type: TabContentItemType.TYPE_ITEM_SECTION_FOCUS_CHANGE_IMG,
    style: buildStyle(sectionItem),
    image: {
      style: {
        width: sectionItem.width,
        height: sectionItem.height
      },
      normal: sectionItem.image,
      focused: sectionItem.imageFocus
    },
    jumpParams: sectionItem.jumpParams,
    imageFocusBackground: sectionItem.imageFocusBackground,
    shimmer: {
      enable: true,
      size: [sectionItem.width, sectionItem.height]
    }
  }
}

/**
 * 封装小窗播放格子数据
 * @param sectionItem 格子数据
 * @param tabPageIndex tab 导航 index
 */
export function buildSmallPlayerSectionItem(sectionItem: SectionItem, tabPageIndex: number): QTWaterfallItem {
  return {
    type: TabContentItemType.TYPE_ITEM_SECTION_CELL_PLAYER,
    style: buildStyle(sectionItem),
    image: {
      style: {
        width: sectionItem.width,
        height: sectionItem.height
      },
      normal: sectionItem.image
    },
    play: {
      style: {
        width: sectionItem.width,
        height: sectionItem.height
      },
      sid: 'cellSid' + sectionItem.id + 'tabIndex' + tabPageIndex,
      playData: sectionItem.playData
    },
    jumpParams: sectionItem.jumpParams
  }
}

/**
 * 封装小窗列表播放格子数据
 * @param sectionItem 格子数据
 * @param tabPageIndex tab 导航 index
 */
export function buildSmallListPlayerSectionItem(sectionItem: SectionItem, tabPageIndex: number): QTWaterfallItem {
  const playData = sectionItem.playData
  if (!playData) {
    return {
      type: TabContentItemType.TYPE_ITEM_SECTION_CELL_PLAYER_LIST,
      style: buildStyle(sectionItem),
    }
  }
  const length = playData.length
  const cellMode = TabContentConfig.cellListItemType
  //设置小窗列表item 高度 ， 文字高度 116， 图片高度 160
  const itemHeight = cellMode === CellListItemType.TYPE_TEXT ? 116 : 160
  const buildPlayData = playData?.map((item,index)=>{
    return cellMode === CellListItemType.TYPE_TEXT ?
      {
        type:86,
        name:TabContentConfig.cellListSectionItemName,
        imgUrl: item.cover,
        text:item.title,
        textFocus:'　'+item.title,
        index,
        itemStyle:{
          width:410,
          height:itemHeight
        },
        gradientBackground: {
          colors: ['#ffffff', '#ffffff'],
          cornerRadii4: [0, index === 0 ? 16 : 0, index === length - 1 ? 16 : 0, 0]
        },
      } : {
        type: index === 0 ? 82 : index === length - 1 ? 84 : 83, // TODO: 让底层支持 flexStyle: { borderTopRightRadius、borderBottomRightRadius }
        name:TabContentConfig.cellListSectionItemName,
        imgUrl:item.cover,
        cover: item.cover,
        itemStyle:{
          width:410,
          height:itemHeight
        },
        gradientBackground: {
          colors: ['#8C000000', '#8C000000'],
          cornerRadii4: [0, index === 0 ? 16 : 0, index === length - 1 ? 16 : 0, 0]
        }
      }
  })
  return {
    type: TabContentItemType.TYPE_ITEM_SECTION_CELL_PLAYER_LIST,
    style: buildStyle(sectionItem),
    image: {
      style: {
        width: sectionItem.width - 410,
        height: sectionItem.height,
      },
      normal: sectionItem.playData[0].cover,
      sid:'cellPlayerListBgSid',
    },
    listStyle:{
      width: 410,
      height:sectionItem.height,
      marginLeft:sectionItem.width - 410
    },
    cellListSid:'cellPlayerListSid',
    play: {
      style: {
        width: sectionItem.width - 410,
        height: sectionItem.height
      },
      sid: 'cellSid' + sectionItem.id + 'tabIndex' + tabPageIndex,
      buildPlayData,
      playData: sectionItem.playData
    }
  }
}

/**
 * 封装占位格子
 * @param sectionItem 格子数据
 */
export function buildPlaceHolderSectionItem(sectionItem: SectionItem): QTWaterfallItem {
  return {
    type: TabContentItemType.TYPE_ITEM_SECTION_PLACEHOLDER,
    style: buildStyle(sectionItem),
    image: {
      style: {
        width: sectionItem.width,
        height: sectionItem.height
      },
      normal: sectionItem.image
    }
  }
}

export function buildTextHistorySectionItem(sectionItem: SectionItem): QTWaterfallItem {
  return {
    type: TabContentItemType.TYPE_ITEM_HISTORY_TEXT,
    style: buildStyle(sectionItem)
  }
}

/**
 * build 板块
 * @param section 板块数据
 * @param sectionWaterfallItemList 板块中格子数据
 * @param isFirstSection 是否第一个板块
 * @param firstSectionMarginTop 首个板块距离顶部距离
 * @param isFocusScrollTarget 焦点滚动
 *
 */
export function buildSection(
  section: Section,
  sectionWaterfallItemList: Array<QTWaterfallItem>,
  isFirstSection: boolean,
  firstSectionMarginTop: number,
  isFocusScrollTarget: boolean
): QTWaterfallSection {
  let buildSection: QTWaterfallSection
  if (section.title?.image && section.title?.style?.height && section.title?.style?.width) {
    buildSection = buildImgSectionTitle(section, sectionWaterfallItemList, isFirstSection, firstSectionMarginTop, isFocusScrollTarget)
  } else {
    buildSection = buildTextSectionTitle(section, sectionWaterfallItemList, isFirstSection, firstSectionMarginTop, isFocusScrollTarget)
  }
  return buildSection
}

/**
 * 文字板块标题 build 对应数据
 * @param section 板块数据
 * @param sectionWaterfallItemList 板块中格子数据
 * @param isFirstSection 是否第一个板块
 * @param firstSectionMarginTop 首个板块距离顶部距离
 * @param isFocusScrollTarget 焦点滚动
 */
export function buildTextSectionTitle(
  section: Section,
  sectionWaterfallItemList: Array<QTWaterfallItem>,
  isFirstSection: boolean,
  firstSectionMarginTop: number,
  isFocusScrollTarget: boolean
): QTWaterfallSection {
  return {
    _id: section.id,
    type: buildSectionType(section.type),
    title: section.showTitle ? section.title.text : '',
    titleStyle: buildSectionTitleStyle(section),
    decoration: buildSectionDecoration(isFirstSection, firstSectionMarginTop),
    style: buildSectionStyle(section.style.height),
    itemList: sectionWaterfallItemList,
    isFocusScrollTarget: isFocusScrollTarget
  }
}

/**
 * 图片板块标题 build 对应数据
 * @param section 板块数据
 * @param sectionWaterfallItemList 板块中格子数据
 * @param isFirstSection 是否第一个板块
 * @param firstSectionMarginTop 首个板块距离顶部距离
 * @param isFocusScrollTarget 焦点滚动
 */
export function buildImgSectionTitle(
  section: Section,
  sectionWaterfallItemList: Array<QTWaterfallItem>,
  isFirstSection: boolean,
  firstSectionMarginTop: number,
  isFocusScrollTarget: boolean
): QTWaterfallSection {
  return {
    _id: section.id,
    type: buildSectionType(section.type),
    imgTitle: section.showTitle ? section.title.image : '',
    imgTitleStyle: buildSectionTitleStyle(section, true),
    decoration: buildSectionDecoration(isFirstSection, firstSectionMarginTop),
    style: buildSectionStyle(section.style.height),
    itemList: sectionWaterfallItemList,
    isFocusScrollTarget: isFocusScrollTarget
  }
}

/**
 * 小 4K 板块 对应数据
 * @param section
 * @param sectionWaterfallItemList
 * @param isFirstSection
 * @param firstSectionMarginTop
 */
export function buildSmallSection(
  section: Section,
  sectionWaterfallItemList: Array<QTWaterfallItem>,
  isFirstSection: boolean,
  firstSectionMarginTop: number
): QTWaterfallSection {
  const isShowPlateName = section.showTitle
  return {
    _id: section.id,
    type: buildSectionType(section.type),
    title: section.showTitle ? section.title.text : '',
    titleStyle: buildSectionTitleStyle(section),
    decoration: buildSectionDecoration(isFirstSection, firstSectionMarginTop),
    style: buildSectionStyle(section.style.height),
    listStyle: { width: 1920, height: 484 },
    replaceChildStyle: {
      width: 860,
      height: 484
    },
    mLayout: isShowPlateName ? [530, TabContentConfig.sectionTitleHeightDefault, 860, 484] : [530, 0, 860, 484],
    itemList: sectionWaterfallItemList
  }
}

/**
 * build 板块 style 数据
 * @param sectionHeight 板块高度
 */
export function buildSectionStyle(sectionHeight: number): QTWaterfallFlexStyle {
  return {
    width: 1920,
    height: sectionHeight,
    marginLeft: -1
    // gradientBackground:{ colors: ['#FFFF00', '#00FFFF'],orientation:0 }
  }
}

/**
 * build 板块间距
 * @param isFirstSection 是否第一个板块
 * @param firstSectionMarginTop 第一个板块距离顶部距离
 */
export function buildSectionDecoration(isFirstSection: boolean, firstSectionMarginTop: number): QTListViewItemDecoration {
  let decoration: QTListViewItemDecoration
  if (isFirstSection) {
    const singleNavBarOffsetY = barsDataManager.barsData.itemList?.length > 1 ? 0 : TabContentConfig.firstSectionOffsetY
    decoration = {
      top: TabContentConfig.firstSectionTop + firstSectionMarginTop + singleNavBarOffsetY
    }
  } else {
    decoration = {
      top: TabContentConfig.sectionItemGap
    }
  }
  return decoration
}

/**
 * build板块类型
 * @param sectionType 板块类型
 */
function buildSectionType(sectionType: SectionType): number {
  let type: number
  switch (sectionType) {
    case SectionType.TYPE_DEFAULT:
      type = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX
      break
    case SectionType.TYPE_LINE_SCROLL:
      type = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_LIST
      break
    case SectionType.TYPE_SWIPER_PLAY:
      type = TabContentItemType.TYPE_WATERFALL_SECTION_SMALL_4K
      break
    default:
      type = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX
      break
  }
  return type
}

/**
 * build板块标题样式
 * @param section 板块数据
 * @param isImgTitle 标题类型
 */
function buildSectionTitleStyle(section: Section, isImgTitle: boolean = false): QTWaterfallFlexStyle & QTFlexStyleText {
  let titleStyle: QTWaterfallFlexStyle & QTFlexStyleText = {
    width: 0,
    height: 0
  }
  if (isImgTitle) {
    if (section.showTitle) {
      titleStyle = {
        width: section.title.style?.width,
        height: section.title.style?.height,
        marginLeft: TabContentConfig.decorationLeftGap
      }
    }
  } else {
    if (section.showTitle) {
      titleStyle = {
        height: TabContentConfig.sectionTitleHeightDefault,
        marginLeft: TabContentConfig.decorationLeftGap,
        fontSize: TabContentConfig.sectionTitleFontSize
      }
    }
  }
  return titleStyle
}

/**
 * 封装 整体格子style
 * @param sectionItem 格子内容
 */
function buildStyle(sectionItem: SectionItem): QTWaterfallFlexStyle {
  return {
    width: sectionItem.width,
    height: sectionItem.height,
    x: sectionItem.posX,
    y: sectionItem.posY
  }
}

/**
 * 封装 Corner 角标
 * @param sectionItem 格子内容
 */
function buildCorner(sectionItem: SectionItem) {
  const colors = sectionItem.corner?.textGradient || ThemeConfig.tabCornerColors
  return {
    enable: !!sectionItem.corner?.text,
    text: sectionItem.corner?.text ?? '',
    background: {
      colors: colors,
      cornerRadii4: [0, ThemeConfig.focusBorderCorner, 0, ThemeConfig.focusBorderCorner],
      orientation: 2
    }
  }
}

/**
 * 底部
 * @param sectionId 板块id
 */
export function buildEndSection(sectionId: string, decoration?: object): QTWaterfallSection {
  return {
    _id: sectionId,
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
    decoration: decoration,
    title: '已经到底啦，按【返回键】回到顶部',
    style: {
      width: 1920,
      height: 200
    },
    titleStyle: {
      fontSize: 30
    },
    itemList: []
  }
}

/**
 * build瀑布流Tab Content内容
 * @param disableScrollOnFirstScreen 首次移动是否滚动
 * @param waterfallSectionList 加载内容
 */
export function buildTabContent(disableScrollOnFirstScreen: boolean = false, sections: Array<QTWaterfallSection>): QTTabPageData {
  return {
    useDiff: false,
    disableScrollOnFirstScreen,
    data: sections,
    bindingPlayer: ''
  }
}

/**
 * 封装 4K 世界 板块数据
 * @param content4kId
 */
export function build4kTabPage(content4kId: string, tabPageIndex: number): QTTabPageData {
  barsDataManager.barsData.itemList[tabPageIndex].isPlay = true
  barsDataManager.barsData.itemList[tabPageIndex].playType = HomePlayType.TYPE_4K
  barsDataManager.barsData.itemList[tabPageIndex].sectionItemIndex = 0
  const cacheList = tabsContent.homeSectionCacheList.get(content4kId)
  const section: QTWaterfallSection = {
    _id: content4kId,
    type: TabContentItemType.TYPE_WATERFALL_SECTION_4K,
    style: {
      width: 1920,
      height: 855
    },
    decoration: {
      top: TabContentConfig.firstSectionTop - 30
    },
    list4KSid: 'plate4K' + content4kId,
    content4kId,
    itemList: cacheList && cacheList?.length > 0 ? cacheList : []
  }
  const tabPage: QTTabPageData = {
    useDiff: false,
    isEndPage: true,
    disableScrollOnFirstScreen: true,
    data: [section]
  }
  return tabPage
}

/**
 * 封装 短视频 板块数据
 * @param shortVideoId
 * @param tabPageIndex
 */
export function buildShortTabPage(shortVideoId: string, tabPageIndex: number): QTTabPageData {
  barsDataManager.barsData.itemList[tabPageIndex].isPlay = true
  barsDataManager.barsData.itemList[tabPageIndex].playType = HomePlayType.TYPE_SHORT_SCREEN
  barsDataManager.barsData.itemList[tabPageIndex].sectionItemIndex = 0
  // TODO test data
  // shortVideoId = "1849006805280256002"
  const cacheList = tabsContent.homeSectionCacheList.get(shortVideoId)
  const section: QTWaterfallSection = {
    _id: shortVideoId,
    type: TabContentItemType.TYPE_WATERFALL_SECTION_SHORT_SCREEN,
    style: {
      width: 556,
      height: 800
    },
    shortList: {
      style: {
        width: 556,
        height: 855
      },
      sid: 'shortVideo' + shortVideoId
    },
    itemList: cacheList && cacheList?.length > 0 ? cacheList : [],
    decoration: {
      top: TabContentConfig.firstSectionTop,
      left: TabContentConfig.decorationLeftGap
    },
    shortVideoId
  }
  const tabPage: QTTabPageData = {
    useDiff: false,
    isEndPage: true,
    disableScrollOnFirstScreen: true,
    data: [section]
  }
  return tabPage
}

/**
 * 封装 4K 板块内容数据
 * @param section4K 原始内容数据
 */
export function build4KSectionData(section4K: Array<Section4KItem>): Array<QTWaterfallItem> {
  const waterfallItems: Array<QTWaterfallItem> = []
  if (section4K && section4K.length > 0) {
    const length = section4K.length
    const endSid = `helloTv4k${section4K[length - 1].id}img`
    const startSid = `helloTv4k${section4K[0].id}img`
    let mCurSid = ''
    for (let section4KItemIndex = 0; section4KItemIndex < length; section4KItemIndex++) {
      const section4kItem = section4K[section4KItemIndex]
      const beforeSid = section4KItemIndex === 0 ? endSid : mCurSid
      mCurSid = `helloTv4k${section4kItem.id}img`
      const nextSid = section4KItemIndex === length - 1 ? startSid : `helloTv4k${section4K[section4KItemIndex + 1].id}img`
      const item: QTWaterfallItem = {
        type: TabContentItemType.TYPE_WATERFALL_SECTION_4K_ITEM,
        sid: mCurSid,
        name: TabContentConfig.world4kSectionItemName,
        image: {
          style: { width: 1413, height: 795 },
          normal: section4kItem.image
        },
        style: {
          width: 1413,
          height: 795
        },
        decoration: { right: 92 },
        title: section4kItem.title,
        subTitle: section4kItem.subTitle,
        subTitleShow: !!section4kItem.subTitle,
        jumpParams: section4kItem.jumpParams,
        play: {
          style: {
            width: 1413,
            height: 795
          },
          playData: section4kItem.playData
        }
      }
      if (section4kItem.playData && section4kItem.playData.length > 0) {
        const buildPlayData = section4kItem.playData[0]
        const sid = {
          beforeSid: beforeSid,
          sid: mCurSid,
          nextSid: nextSid
        }
        item.play.playData = [{ ...buildPlayData, ...sid }]
      }
      waterfallItems.push(item)
    }
  }
  return waterfallItems
}

/**
 * 封装 短视频 板块内容数据
 * @param shortVideoData 原始内容数据
 */
export function buildShortVideoSectionData(shortVideoData: Array<Section4KItem>): Array<QTWaterfallItem> {
  const waterfallItems: Array<QTWaterfallItem> = []
  if (shortVideoData && shortVideoData.length > 0) {
    for (const shortItem of shortVideoData) {
      const shortItemIndex: number = shortVideoData.indexOf(shortItem)
      const item: QTWaterfallItem = {
        type: TabContentItemType.TYPE_WATERFALL_SECTION_SHORT_SCREEN_ITEM,
        name: TabContentConfig.shortVideoSectionItemName,
        style: {
          width: 540,
          height: 144
        },
        decoration: {
          top: shortItemIndex == 0 ? 8 : 10,
          left: 8,
          bottom: 16
        },
        image: {
          normal: shortItem.image
        },
        title: {
          text: shortItem.title,
          textFocus: '　 ' + shortItem.title,
          sub: shortItem.subTitle
        },
        jumpParams: shortItem.jumpParams,
        play: {
          playData: shortItem.playData
        }
      }
      waterfallItems.push(item)
    }
  }
  return waterfallItems
}

export async function buildSmall4KSection(
  section: Section,
  tabPageIndex: number,
  sectionIndex: number,
  isFirstSection: boolean,
  firstSectionMarginTop: number
): Promise<QTWaterfallSection> {
  let buildSection: QTWaterfallSection = { itemList: [], style: {}, type: -1 }
  barsDataManager.barsData.itemList[tabPageIndex].isPlay = true
  barsDataManager.barsData.itemList[tabPageIndex].playType = HomePlayType.TYPE_SMALL_4K
  barsDataManager.barsData.itemList[tabPageIndex].sectionItemIndex = 0
  barsDataManager.barsData.itemList[tabPageIndex].sectionIndex = sectionIndex
  // todo 记得放开 contentId
  const res: Array<QTWaterfallItem> = await homeManager.get4KSection(
    section.contentId + '',
    10,
    TabContentItemType.TYPE_WATERFALL_SECTION_SMALL_4K
  )
  // const res: Array<QTWaterfallItem> = await homeManager.get4KSection('1849006805280256002', 10, TabContentItemType.TYPE_WATERFALL_SECTION_SMALL_4K)
  if (res && res.length > 0) {
    buildSection = buildSmallSection(section, res, isFirstSection, firstSectionMarginTop)
  }
  return buildSection
}

export function buildSmall4KSectionData(sectionSmall4K: Array<Section4KItem>): Array<QTWaterfallItem> {
  const waterfallItems: Array<QTWaterfallItem> = []
  if (sectionSmall4K && sectionSmall4K.length > 0) {
    const length = sectionSmall4K.length
    let mCurSid = ''
    for (let index = 0; index < length; index++) {
      const sectionItem = sectionSmall4K[index]
      mCurSid = `helloTvSmall4k${sectionItem.id}img`
      const item: QTWaterfallItem = {
        type: TabContentItemType.TYPE_WATERFALL_SECTION_SMALL_4K_ITEM,
        sid: mCurSid,
        name: TabContentConfig.worldSmall4kSectionItemName,
        image: {
          style: { width: 860, height: 484 },
          normal: sectionItem.image
        },
        style: { width: 860, height: 484 },
        decoration: { right: 92 },
        jumpParams: sectionItem.jumpParams,
        play: {
          style: {
            width: 860,
            height: 484
          },
          playData: sectionItem.playData
        }
      }
      waterfallItems.push(item)
    }
  }
  return waterfallItems
}
