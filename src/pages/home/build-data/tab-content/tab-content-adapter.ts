import { QTTabPageData, QTWaterfallSection } from '@quicktvui/quicktvui3'
import { Section, TabContent } from './imp-tab-content'

class TabsContent {
  //存储板块高度
  sectionTotalHeight: Map<string, number> = new Map<string, number>()
  //存储二屏图
  tab2BackgroundUrls: Map<string, string> = new Map<string, string>()
  //板块间距
  sectionGap: 36
  //板块标题默认高度
  sectionTitleHeightDefault = 60

}

const tabsContent = new TabsContent()
export default tabsContent

/**
 * 解析导航下对应内容
 * @param tabContent
 */
export function buildTabContentAdapter(tabContent: TabContent, pageNo: number = 1, tabId: string, tabPageIndex?: number): QTTabPageData {
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
      //获取板块高度
      const sectionHeight: number = getSectionHeight(section)
      //存储板块高度
      saveSectionTotalHeight(sectionHeight,tabId)
      // build section列表数据
    }
  }
}

/**
 * 获取板块高度
 * @param section
 */
export function getSectionHeight(section: Section): number {
  let sectionHeight: number = section.style.height
  //获取是否展示板块标题 flag
  const showTitle = section.showTitle
  if (showTitle) {
    sectionHeight += tabsContent.sectionGap + tabsContent.sectionTitleHeightDefault
  }
  return sectionHeight
}

/**
 * 存储板块整体高度
 * @param sectionHeightSum 已有板块高度
 * @param tabId 导航 ID
 */
export function saveSectionTotalHeight(sectionHeight:number, tabId:string):void{
  const sectionHeightOld = tabsContent.sectionTotalHeight.get(tabId)
  const totalH = sectionHeightOld + sectionHeight
  tabsContent.sectionTotalHeight.set(tabId,totalH)
}

/**
 * 获取板块总高度
 * @param tabId
 */
export function getSectionTotalHeight(tabId:string):number{
   const totalHeight = tabsContent.sectionTotalHeight.get(tabId) || 0
   return totalHeight
}

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
