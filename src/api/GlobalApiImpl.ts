import {IGlobalApi} from "./IGlobalApi";
import {RequestManager} from "./request/RequestManager";
import {QTTab, QTTabPageData,QTListViewItem,QTTabItem} from "@quicktvui/quicktvui3";
import {Tab} from "../pages/home/build_data/tab/impl/Tab";
import tabMockJson from "./home/mock/home_tab";
import {
  buildTransferTabAdapter,
  getTabBackground
} from "../pages/home/build_data/tab/TabTransferAdapter";
import tabPage0MockJson from "./home/mock/home_page0";
import tabPage1MockJson from "./home/mock/home_page1";
import tabPage2MockJson from "./home/mock/home_page2";
import tabPage3MockJson from "./home/mock/home_page3";
import {buildTransferTabContentAdapter} from "../pages/home/build_data/tab_content/TabContentTransferAdapter";
import {ESApp} from "@extscreen/es3-vue";
import {GlobalApiKey} from "./UseApi";
import BuildConfig from "../build/BuildConfig";
import {
  filterContentUrl,
  filterEntryUrl,
  hotSearchUrl,
  tabContentUrl,
  tabListUrl
} from "./RequestUrl";
import {buildO2MTabContentData, buildO2MTabData} from "../pages/home/build_data/useTabData";
import {TabPlayItem} from "../pages/home/build_data/tab_content/impl/TabPlayItem";

/*****
  ***************搜索 *********
*****/
import {
  buildSearchCenterListData,
  buildSearchResultData,
  buildSearchTabData
} from "../pages/search/build_data/useSearchData"
import searchCenterList from "./search/mock/search_center_list";
import searchResultTabList from "./search/mock/search_result_tab_list";
import searchRecommendTabList from "./search/mock/search_recommend_tab";
import searchResultPageData from "./search/mock/search_result_page_data";
import searchResultPageData2 from "./search/mock/search_result_page_data2";
import searchRecommendResultData from "./search/mock/search_result_recommend_data";
import SearchConfig from "../pages/search/build_data/SearchConfig"
import { SearchCenter } from "../pages/search/build_data/impl/SearchCenter"
import { SearchTab } from "../pages/search/build_data/impl/SearchTab"
import { SearchResult } from "../pages/search/build_data/impl/SearchResult"
export function createGlobalApi(): IGlobalApi {
  let requestManager: RequestManager
  function init(...params: any[]): Promise<any> {
    requestManager = params[0]
    return Promise.resolve()
  }

  function getTabList(): Promise<QTTab> {
    //使用本地数据
    if (BuildConfig.useMockData) {
      return getMockTabList()
    }
    return requestManager.post(tabListUrl, {})
      .then((tabList: Array<any>) => {
        return buildO2MTabData(tabList)
      })
  }

  function getMockTabList(): Promise<QTTab> {
    const tabs: Array<Tab> = tabMockJson as Array<Tab>
    return Promise.resolve(buildTransferTabAdapter(tabs))
  }

  function getTabContent(tabId: string, pageNo: number, pageSize: number): Promise<QTTabPageData> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData) {
      return getMockTabContent(tabId, pageNo)
    }
    return requestManager.post(tabContentUrl, {
      'data': tabId,
      'param': {
        'isSupportPage': 1,
        "pageNo": pageNo,
        "pageSize": pageSize,
      }
    }).then((tabContent: any) => {
      return buildO2MTabContentData(tabContent, pageNo,tabId)
    })
  }

  function getMockTabContent(tabId: string, pageNo: number,): Promise<QTTabPageData> {
    const name: Array<any> = [tabPage0MockJson, tabPage1MockJson, tabPage2MockJson, tabPage3MockJson]
    const index = Number(tabId)
    return Promise.resolve(buildTransferTabContentAdapter(name[index], pageNo,tabId))
  }

  function getTabBg(tabId): string {
    return getTabBackground(tabId)
  }

  function getHomeBgVideoAssetsUrl(playDataItem:TabPlayItem):Promise<TabPlayItem>{
    //todo 实现获取播放地址接口
    return Promise.resolve({
      id:playDataItem.id,
      title:playDataItem.title,
      cover:playDataItem.cover,
      url:"http://qcloudcdn.a311.ottcn.com/channelzero/2022/01/04/e6693388-4867-47d7-ba5d-e21ef66e744c_transcode_1137857.m3u8",
      isRequestUrl:false})
  }

  //***************************************************搜索相关***************
  function getHotSearch(pageNum:number,keyword?: string): Promise<SearchCenter> {
    if (BuildConfig.useMockData) {
      let list:Array<any> = []
      if(searchCenterList.keywordList.length > 0) list = searchCenterList.keywordList
      const isLoadHistory = searchCenterList.historyList.length > 0
      if(isLoadHistory) list = searchCenterList.historyList
      return Promise.resolve(buildSearchCenterListData(list, isLoadHistory))
    }
    // 根据keyword字母搜索关键字 不传返回热门搜索
    return requestManager.post(hotSearchUrl, {'data': keyword,param:{pageNo:pageNum,pageSize:SearchConfig.screenCenterPageSize}})
      .then((result: any) => {
        let list:Array<any> = []
        if(result.keywordList.length > 0) list = result.keywordList
        if(result.historyList.length > 0) list = result.historyList
        return buildSearchCenterListData(list,result.historyList.length > 0)
      })
  }

  function clearHistory():void{

  }

  function getSearchResultTabList(isHotRecommend:boolean): Promise<Array<QTTabItem>> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData || true) {
      if (isHotRecommend){
        return Promise.resolve(buildSearchTabData(searchRecommendTabList as Array<SearchTab>))
      }else{
        return Promise.resolve(buildSearchTabData(searchResultTabList as Array<SearchTab>))
      }
    }
  }

  function getSearchResultPageData(tabId:string,pageNo: number, pageSize: number,singleTab:boolean): Promise<QTTabPageData> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData || true) {
      if( pageNo === 3 ) { //模拟结束
        return Promise.resolve(buildSearchResultData({ itemList: [] }, pageNo,singleTab))
      }
      const result = pageNo === 1 ? searchResultPageData : searchResultPageData2
      return Promise.resolve(buildSearchResultData(result as SearchResult, pageNo,singleTab))
    }
  }

  function getRecommendPageData(tabId:string,pageNo: number, pageSize: number,singleTab:boolean): Promise<QTTabPageData> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData || true) {
      if( pageNo === 3 ) { //模拟结束
        return Promise.resolve(buildSearchResultData({ itemList: [] }, pageNo,singleTab))
      }
      const result = pageNo === 1 ? searchRecommendResultData : searchResultPageData2
      return Promise.resolve(buildSearchResultData(result as SearchResult, pageNo,singleTab))
    }
  }

  /********************************筛选相关*****************************/
  function getScreenLeftTags(screenId:string) {
    const requestUrl = filterEntryUrl+screenId
    return requestManager.post(requestUrl,{})
  }

  function getScreenContentByTags(tags,pageNum){
    const params = requestManager.getParams()
    const pageParams = {
      "pageNo": pageNum,
      "pageSize": SearchConfig.screenPageSize,
    };
    const newParams = {...params, ...pageParams};
    return requestManager.post(filterContentUrl,{
      'param': newParams,
      'data': tags
    })
  }

  return {
    install: function (app: ESApp) {
      const instance = this
      app.provide(GlobalApiKey, instance)
    },
    init,
    getTabList,
    getTabContent,
    getTabBg,
    getHomeBgVideoAssetsUrl,
    getHotSearch,
    clearHistory,
    getSearchResultTabList,
    getSearchResultPageData,
    getRecommendPageData,
    getScreenLeftTags,
    getScreenContentByTags
  }
}
