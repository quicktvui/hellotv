import { QTTab } from '@quicktvui/quicktvui3'
import requestManager from '../request/request-manager'
import { tabListUrl } from '../request/request-url'
import { HomeApi } from './imp-home'

class HomeManager implements HomeApi{

  getTabList(): Promise<QTTab> {
    console.log("XRG===","获取tab数据 start")
    return requestManager.post(tabListUrl,{}).then((tabList: Array<any>) => {
      console.log("XRG",tabList)
      return
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
