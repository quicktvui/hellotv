import { QTTab, QTTabPageData, QTWaterfallItem } from '@quicktvui/quicktvui3'

export interface ActivityApi {
 
  getTabContent(tabId: string, pageNo: number, limit: number): Promise<QTTabPageData>

  getHomePlayUrl(id: string,type:number): Promise<object>
  
  
}

