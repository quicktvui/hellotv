import { QTTab } from '@quicktvui/quicktvui3'
import { buildNavBarAdapter } from '../../pages/home/build-data/nav-bar/nav-bar-adapter'
import requestManager from '../request/request-manager'
import { tabListUrl } from '../request/request-url'
import { HomeApi } from './imp-home'
import BuildConfig from '../../config/build-config'

class HomeManager implements HomeApi{

  getTabList(): Promise<QTTab> {
    const url = tabListUrl + BuildConfig.packageName
    return requestManager.get(url).then((tabList: Array<any>) => {
      return buildNavBarAdapter(tabList)
    })
  }

  getHomeBgVideoAssetsUrl(id: string): Promise<object> {
    return Promise.resolve({});
  }

  getTabBg(tabId): string {
    return '';
  }

  getTabContent(tabId: string, pageNo: number, pageSize: number, tabPageIndex?: number): Promise<QTTabPageData> {
    return Promise.resolve({});
  }



}

const homeManager = new HomeManager()
export default homeManager
