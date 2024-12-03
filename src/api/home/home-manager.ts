import { QTTab, QTTabPageData } from '@quicktvui/quicktvui3'
import barsDataManager, { buildNavBarAdapter } from '../../pages/home/build-data/nav-bar/nav-bar-adapter'
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
  getTabContent(tabId: string, pageNo: number, pageSize: number, tabPageIndex?: number): Promise<QTTabPageData> {
    const replacements = {
      id:tabId,
      packageName:BuildConfig.packageName,
      page:pageNo,
      limit:pageSize
    }
    const url = replacePlaceholders(tabContentUrl,replacements)
    return requestManager.get(url).then((tabContent:any)=>{
      console.log(`XRG==tabId===${tabId}=`,tabContent)
      return Promise.resolve({});
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
