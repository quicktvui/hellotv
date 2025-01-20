import { QTTab, QTTabPageData, QTWaterfallItem } from '@quicktvui/quicktvui3'
import barsDataManager, { buildTabBarAdapter } from '../adapter/tab-bar/tab-bar-adapter'
import {
  build4KSectionData,
  buildSmall4KSectionData,
  buildTabContentAdapter
} from '../adapter/tab-content/tab-content-adapter'
import requestManager from '../../../tools/request'
import { Section4KItem, TabContent } from '../adapter/tab-content/tab-content-imp'
import TabContentItemType from '../adapter/tab-content/tab-content-item-type'
import {
  home4KUrl,
  homePlayUrl,
  tabContentUrl,
  tabListUrl
} from './request-url'
import { HomeApi } from '../adapter/interface'
import BuildConfig from '../../../config/build-config'
import {replacePlaceholders} from '../../../tools/common'


class HomeManager implements HomeApi{

  /**
   * 获取导航数据
   *
   */
  getTabList(): Promise<QTTab> {
    const url = tabListUrl + BuildConfig.packageName
    return requestManager.get(url)
  }

  /**
   * 获取导航对应内容
   * @param tabId
   * @param pageNo
   * @param limit
   * @param tabPageIndex
   */
  getTabContent(tabId: string, pageNo: number, limit: number, tabPageIndex: number): Promise<QTTabPageData> {
    const replacements = {
      id:tabId,
      packageName:BuildConfig.packageName,
      page:pageNo,
      limit:limit
    }
    const url = replacePlaceholders(tabContentUrl,replacements)
    return requestManager.get(url)
  }

  getHomePlayUrl(id: string,type:number): Promise<object> {
    const replacements = {
      id:id,
      packageName:BuildConfig.packageName,
      type:type
    }
    const url = replacePlaceholders(homePlayUrl,replacements)
    return requestManager.get(url)
  }

  getTabBg(tabId): string | undefined {
    return barsDataManager.barsBgUrls.get(tabId)
  }

  async get4KSection(content4kId:string,size:number,type:number):Promise<Array<QTWaterfallItem>>{
    const replacements = {
      id:content4kId,
      packageName:BuildConfig.packageName,
    }
    const url = replacePlaceholders(home4KUrl,replacements)
    return requestManager.get(url).then((res:Array<Section4KItem>)=>{
      let dealRes = res
      if (res && res.length > size){
        dealRes = res.slice(0,size)
      }
      if (type === TabContentItemType.TYPE_WATERFALL_SECTION_SMALL_4K){
        return buildSmall4KSectionData(dealRes)
      }
      return build4KSectionData(dealRes)
    },()=>{
      if (type === TabContentItemType.TYPE_WATERFALL_SECTION_SMALL_4K){
        return buildSmall4KSectionData([])
      }
      return build4KSectionData([])
    })
  }
}

const homeManager = new HomeManager()
export default homeManager
