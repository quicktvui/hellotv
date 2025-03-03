import { QTTab, QTTabPageData, QTWaterfallItem } from '@quicktvui/quicktvui3'
import requestManager from '../../../tools/request'
import {tabContentUrl, activityPlayUrl} from './request-url'
import { ActivityApi } from './interface'
import BuildConfig from '../../../config/build-config'
import {replacePlaceholders} from '../../../tools/common'

class ActivityManager implements ActivityApi{

  getTabContent(tabId: string, pageNo: number, limit: number): Promise<QTTabPageData> {
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
    const url = replacePlaceholders(activityPlayUrl,replacements)
    return requestManager.get(url)
  }
}

const activityManager = new ActivityManager()
export default activityManager
