import { QTTab, QTTabPageData } from '@quicktvui/quicktvui3'

export interface HomeApi {
  /**
   * 获取瀑布流Tab数据
   */
  getTabList(): Promise<QTTab>

  /**
   * 获取Tab 背景
   * @param tabId
   */
  getTabBg(tabId): string | undefined

  /**
   * 获取首页瀑布流指定Tab对应内容
   * @param tabId tab ID
   * @param pageNo 分页值
   * @param pageSize 每页请求个数
   */
  getTabContent(tabId: string, pageNo: number, limit: number, tabPageIndex?: number): Promise<QTTabPageData>

  /**
   * 获取首页背景播放请求地址
   * @param id
   * @param type 1 长视频、2 短视频
   */
  getHomePlayUrl(id: string,type:number): Promise<object>


}

