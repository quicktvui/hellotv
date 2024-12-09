import { QTTab, QTTabPageData } from '@quicktvui/quicktvui3'
import barsDataManager, { buildNavBarAdapter } from '../../pages/home/build-data/nav-bar/nav-bar-adapter'
import { buildTabContentAdapter } from '../../pages/home/build-data/tab-content/tab-content-adapter'
import { TabContent } from '../../pages/home/build-data/tab-content/tab-content-imp'
import requestManager from '../request/request-manager'
import { replacePlaceholders, tabContentUrl, tabListUrl } from '../request/request-url'
import { HomeApi } from './imp-home'
import BuildConfig from '../../config/build-config'

class HomeManager implements HomeApi{

  /**
   * 获取导航数据
   */
  getTabList(): Promise<QTTab> {
    const url = tabListUrl + BuildConfig.packageName
    return requestManager.get(url).then((tabList: Array<any>) => {
      return buildNavBarAdapter(tabList)
    })
  }

  /**
   * 获取导航对应内容
   * @param tabId
   * @param pageNo
   * @param pageSize
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
    return requestManager.get(url).then((tabContent:TabContent)=>{
      return buildTabContentAdapter(tabContent,pageNo,tabId,tabPageIndex)
    })

  }

  getHomeBgVideoAssetsUrl(id: string): Promise<object> {
    return Promise.resolve({});
  }

  getTabBg(tabId): string | undefined {
    return barsDataManager.barsBgUrls.get(tabId)
  }





}

const homeManager = new HomeManager()
export default homeManager
