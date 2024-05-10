import {QTTab, QTTabPageData} from "@quicktvui/quicktvui3";
import {TabPlayItem} from "../../pages/home/build_data/tab_content/impl/TabPlayItem";

export interface IHomeDataSource {
  /**
   * 获取瀑布流Tab数据
   */
  getTabList(): Promise<QTTab>

  /**
   * 获取首页瀑布流指定Tab对应内容
   * @param tabId tab ID
   * @param pageNo 分页值
   * @param pageSize 每页请求个数
   */
    getTabContent(tabId: string, pageNo: number, pageSize: number,tabPageIndex?: number): Promise<QTTabPageData>

  /**
   * 获取首页背景播放请求地址
   * @param id
   */
    getHomeBgVideoAssetsUrl(id:string):Promise<object>

  /**
   * 获取Tab 背景
   * @param tabId
   */
    getTabBg(tabId):string

}

