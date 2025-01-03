import {
  QTFlexStyleText,
  QTTabPageData,
  QTWaterfallItem,
  QTWaterfallSection,
  QTWaterfallSectionType
} from '@quicktvui/quicktvui3'
import { QTListViewItemDecoration } from '@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItemDecoration'
import { QTWaterfallFlexStyle } from '@quicktvui/quicktvui3/dist/src/waterfall/core/QTWaterfallFlexStyle'
import ThemeConfig from '../../../../config/theme-config'
import barsDataManager from '../nav-bar/nav-bar-adapter'
import TabContentConfig from './tab-content-config'
import { Section, SectionItem, SectionItemType, SectionType, TabContent } from './tab-content-imp'
import TabContentItemType from './tab-content-item-type'

class TabsContent {
  //存储板块高度
  sectionTotalHeight: Map<string, number> = new Map<string, number>()
  //存储二屏图
  tab2BackgroundUrls: Map<string, string> = new Map<string, string>()

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
export function buildTabContentAdapter(tabContent: TabContent, pageNo: number = 1, tabId: string, tabPageIndex: number): QTTabPageData {
  if (!tabContent || !tabContent.sectionList || tabContent.sectionList.length === 0) {
    return {
      data: []
    }
  }
  const isFirstPage = pageNo === 1
  //首次加载清除当前板块高度
  if (isFirstPage) {
    tabsContent.sectionTotalHeight.delete(tabId)
  }
  //存储二屏图
  if (tabContent.backgroundImg != null) {
    tabsContent.tab2BackgroundUrls.set(tabId, tabContent.backgroundImg)
  }
  //解析自定义参数
  const {
    firstSectionMarginTop,
    disableScrollOnFirstScreen
  } = parseParameter(tabContent.customParams)
  //获取当前导航Tab下Section原始数据
  const sectionSourceData: Array<Section> = tabContent.sectionList
  //创建sectionList板块集合列表
  const sectionList: Array<QTWaterfallSection> = []
  if (sectionSourceData && sectionSourceData.length > 0) {
    for (let sectionIndex = 0; sectionIndex < sectionSourceData.length; sectionIndex++) {
      const section: Section = sectionSourceData[sectionIndex]
      //如果是图片标题 板块标题高度从后台获取
      if (section.title?.image && section.title?.style?.height && section.title?.style?.width) {
        TabContentConfig.sectionTitleHeightDefault = section.title.style.height
      }
      //获取板块高度
      const sectionHeight: number = getSectionHeight(section)
      //存储板块高度 用于判断是否展示底部提示
      saveSectionTotalHeight(sectionHeight, tabId)
      // build section列表数据
      const res = buildSectionItemList(section, sectionIndex, tabPageIndex)
      const sectionWaterfallItemList: Array<QTWaterfallItem> = res.buildSectionItemList
      const isFocusScrollTarget: boolean = res.isFocusScrollTarget
      //获取展示的板块高度
      section.style.height = buildSectionHeightBySectionType(section)
      const firstSectionIndex: boolean = sectionIndex === 0 && isFirstPage
      //build 板块数据
      const buildSectionData: QTWaterfallSection = buildSection(section, sectionWaterfallItemList, firstSectionIndex, firstSectionMarginTop, isFocusScrollTarget)
      sectionList.push(buildSectionData)
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
  if (sectionTotalHeight > 1080 && curLoadTotal >= tabContent.total) {
    isLoadPageEnd = true
    const endSection = buildEndSection('5')
    sectionList.push(endSection)
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
  if (sectionType === SectionType.TYPE_DEFAULT) {//默认flex布局的板块 会自动计算板块标题高度所以此处减掉板块标题高度
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
    sectionHeight += TabContentConfig.sectionGap + TabContentConfig.sectionTitleHeightDefault
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
export function buildSectionItemList(section: Section, sectionIndex: number, tabPageIndex: number): { buildSectionItemList: Array<QTWaterfallItem>, isFocusScrollTarget: boolean } {
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
    for (const sectionItem of sectionItemList) {
      const sectionItemIndex: number = sectionItemList.indexOf(sectionItem)
      if (sectionIndex === 0) {
        //检测第一个板块中是否有播放器
        const sectionItemType = sectionItem.type
        if (sectionItemType === SectionItemType.TYPE_SMALL_PLAY || sectionItemType === SectionItemType.TYPE_SMALL_LIST_PLAY) {
          isFocusScrollTarget = true
        }
      }
      //封装格子数据
      const qtWaterfallItem: QTWaterfallItem = buildSectionItem(sectionItem, showTitle, tabPageIndex, type)
      //针对一行滚动格子设置decoration
      if (type === SectionType.TYPE_LINE_SCROLL) {
        qtWaterfallItem.decoration = {
          left: sectionItemIndex === 0 ? TabContentConfig.decorationLeftGap : TabContentConfig.sectionItemGap,
          right: (sectionItemIndex === (length - 1)) ? TabContentConfig.decorationLeftGap : 0,
          top: section.showTitle ? TabContentConfig.sectionItemGap : 0
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
export function buildSectionItem(sectionItem: SectionItem, showTitle: boolean, tabPageIndex: number, sectionType: number | string): QTWaterfallItem {
  //根据是否展示板块标题和是否是一行滚动
  const posY = sectionItem.posY + (showTitle ? TabContentConfig.sectionItemGap : 0)
  if (sectionType === SectionType.TYPE_LINE_SCROLL) {
    sectionItem.posY = 0
  } else {
    sectionItem.posY = posY
  }
  let buildSectionItem: QTWaterfallItem
  const sectionItemType: SectionItemType = sectionItem.type
  switch (sectionItemType) {
    case SectionItemType.TYPE_DEFAULT://无标题
      buildSectionItem = buildNoTitleSectionItem(sectionItem)
      break
    case SectionItemType.TYPE_INNER:
    case SectionItemType.TYPE_OUT: //带标题
      buildSectionItem = buildTitleSectionItem(sectionItem)
      break
    case SectionItemType.TYPE_PLACE_HOLDER://占位格子
      buildSectionItem = buildPlaceHolderSectionItem(sectionItem)
      break
    // case SectionItemType.TYPE_TEXT_HISTORY:
    //   break
    // case SectionItemType.TYPE_IMG_HISTORY:
    //   break
    case SectionItemType.TYPE_FOCUS_CHANGE_IMG://焦点换图格子
      buildSectionItem = buildFocusChangeImgSectionItem(sectionItem)
      break
    case SectionItemType.TYPE_SMALL_PLAY://小窗播放
      buildSectionItem = buildSmallPlayerSectionItem(sectionItem,tabPageIndex)
      break
    // case SectionItemType.TYPE_SMALL_LIST_PLAY:
    //   break
    default://默认--无标题格子
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

export function buildSmallPlayerSectionItem(sectionItem: SectionItem,tabPageIndex:number): QTWaterfallItem {
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
      sid:sectionItem.id + 'cellSid'+'tabIndex'+tabPageIndex,
      playData:sectionItem.playData
    },
    jumpParams: sectionItem.jumpParams

  }
}

/**
 * 封装占位格子
 * @param sectionItem 格子数据
 */
export function buildPlaceHolderSectionItem(sectionItem: SectionItem): QTWaterfallItem {
  return {
    type: TabContentItemType.TYPE_ITEM_SECTION_PLACE_HOLDER,
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

/**
 * build 板块
 * @param section 板块数据
 * @param sectionWaterfallItemList 板块中格子数据
 * @param isFirstSection 是否第一个板块
 * @param firstSectionMarginTop 首个板块距离顶部距离
 * @param isFocusScrollTarget 焦点滚动
 *
 */
export function buildSection(section: Section, sectionWaterfallItemList: Array<QTWaterfallItem>, isFirstSection: boolean, firstSectionMarginTop: number, isFocusScrollTarget: boolean): QTWaterfallSection {
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
export function buildTextSectionTitle(section: Section, sectionWaterfallItemList: Array<QTWaterfallItem>, isFirstSection: boolean, firstSectionMarginTop: number, isFocusScrollTarget: boolean): QTWaterfallSection {
  return {
    _id: section.id,
    type: buildSectionType(section.type),
    title: section.showTitle ? section.title.text : '',
    titleStyle: buildSectionTitleStyle(section),
    decoration: buildSectionDecoration(section, isFirstSection, firstSectionMarginTop),
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
export function buildImgSectionTitle(section: Section, sectionWaterfallItemList: Array<QTWaterfallItem>, isFirstSection: boolean, firstSectionMarginTop: number, isFocusScrollTarget: boolean): QTWaterfallSection {
  return {
    _id: section.id,
    type: buildSectionType(section.type),
    imgTitle: section.showTitle ? section.title.image : '',
    imgTitleStyle: buildSectionTitleStyle(section, true),
    decoration: buildSectionDecoration(section, isFirstSection, firstSectionMarginTop),
    style: buildSectionStyle(section.style.height),
    itemList: sectionWaterfallItemList,
    isFocusScrollTarget: isFocusScrollTarget
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
 * @param section 板块数据
 * @param isFirstSection 是否第一个板块
 * @param firstSectionMarginTop 第一个板块距离顶部距离
 */
export function buildSectionDecoration(section: Section, isFirstSection: boolean, firstSectionMarginTop: number): QTListViewItemDecoration {
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
export function buildEndSection(sectionId: string): QTWaterfallSection {
  return {
    _id: sectionId,
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
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
export function buildTabContent(disableScrollOnFirstScreen: boolean = false, waterfallSectionList: Array<QTWaterfallSection>): QTTabPageData {
  return {
    useDiff: false,
    disableScrollOnFirstScreen,
    data: waterfallSectionList,
    bindingPlayer: ''
  }
}
