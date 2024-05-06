import FilterConfig from "../pages/filter/build_data/FilterConfig"
import { IGlobalApi } from "./IGlobalApi";
import { RequestManager } from "./request/RequestManager";
import { QTTab, QTTabPageData, QTListViewItem, QTTabItem } from "@quicktvui/quicktvui3";
import { Tab } from "../pages/home/build_data/tab/impl/Tab";
import tabMockJson from "./home/mock/home_tab";
import {
  buildTransferTabAdapter,
  getTabBackground
} from "../pages/home/build_data/tab/TabTransferAdapter";
import tabPage0MockJson from "./home/mock/home_page0";
import tabPage1MockJson from "./home/mock/home_page1";
import tabPage2MockJson from "./home/mock/home_page2";
import tabPage3MockJson from "./home/mock/home_page3";
import { buildTransferTabContentAdapter } from "../pages/home/build_data/tab_content/TabContentTransferAdapter";
import { ESApp } from "@extscreen/es3-vue";
import { GlobalApiKey } from "./UseApi";
import BuildConfig from "../build/BuildConfig";
import {
  filterContentUrl,
  filterEntryUrl,
  hotSearchUrl,
  tabContentUrl,
  tabListUrl,
  urlSaveHistory, urlGetHistory, urlGetLongHistory, urlGetShortHistory, urlGetBookHistory
} from "./RequestUrl";
import { buildO2MTabContentData, buildO2MTabData } from "../pages/home/build_data/useTabData";
import { TabPlayItem } from "../pages/home/build_data/tab_content/impl/TabPlayItem";

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

function getInnerArgs(mediaId: number | string) {
  return JSON.stringify({
    params: {
      mediaId: mediaId,
      episodeId: 0,
      episodeIndex: 0,
      startPosition: 0
    },
    url: 'series_view'
  })
}

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
    return requestManager.cmsGet(tabListUrl())
      .then((result: any) => buildO2MTabData(result.class))
  }

  function getMockTabList(): Promise<QTTab> {
    const tabs: Array<Tab> = tabMockJson as Array<Tab>
    return Promise.resolve(buildTransferTabAdapter(tabs))
  }

  function getTabContent(tabId: string, pageNo: number, pageSize: number, tabPageIndex?: number): Promise<QTTabPageData> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData) {
      return getMockTabContent(tabId, pageNo, tabPageIndex)
    }
    return requestManager.cmsGet(tabContentUrl() + `&t=${tabId}&pg=${pageNo}&pagesize=${pageSize * 6}`)
      .then(async (result: any) => buildO2MTabContentData(result, pageNo, tabId))
  }

  function getMockTabContent(tabId: string, pageNo: number, tabPageIndex?: number): Promise<QTTabPageData> {
    const name: Array<any> = [tabPage0MockJson, tabPage1MockJson, tabPage2MockJson, tabPage3MockJson]
    const index = Number(tabId)
    return Promise.resolve(buildTransferTabContentAdapter(name[index], pageNo, tabId, tabPageIndex))
  }

  function getTabBg(tabId): string {
    return getTabBackground(tabId)
  }

  function getHomeBgVideoAssetsUrl(playDataItem: TabPlayItem): Promise<TabPlayItem> {
    //todo 实现获取播放地址接口
    return Promise.resolve({
      id: playDataItem.id,
      title: playDataItem.title,
      cover: playDataItem.cover,
      url: "http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
      isRequestUrl: false
    })
  }

  //***************************************************搜索相关***************
  function getHotSearch(pageNum: number, keyword?: string): Promise<SearchCenter> {
    if (BuildConfig.useMockData) {
      let list: Array<any> = []
      if (searchCenterList.keywordList.length > 0) list = searchCenterList.keywordList
      const isLoadHistory = searchCenterList.historyList.length > 0
      if (isLoadHistory) list = searchCenterList.historyList
      return Promise.resolve(buildSearchCenterListData(list, isLoadHistory))
    }
    // 根据keyword字母搜索关键字 不传返回热门搜索
    return requestManager.post(hotSearchUrl(), { 'data': keyword, param: { pageNo: pageNum, pageSize: SearchConfig.searchCenterPageSize } })
      .then((result: any) => {
        let list: Array<any> = []
        if (result.keywordList.length > 0) list = result.keywordList
        if (result.historyList.length > 0) list = result.historyList
        return buildSearchCenterListData(list, result.historyList.length > 0)
      })
  }

  function clearHistory(): void {

  }

  function getSearchResultTabList(isHotRecommend: boolean): Promise<Array<QTTabItem>> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData) {
      if (isHotRecommend) {
        return Promise.resolve(buildSearchTabData(searchRecommendTabList as Array<SearchTab>))
      } else {
        return Promise.resolve(buildSearchTabData(searchResultTabList as Array<SearchTab>))
      }
    }

    return Promise.resolve(buildSearchTabData([{ id: '0', tabCode: '0', title: '全部' }]))
  }

  function getSearchResultPageData(keyword: string, pageNo: number, pageSize: number, singleTab: boolean): Promise<QTTabPageData> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData) {
      if (pageNo === 3) { //模拟结束
        return Promise.resolve(buildSearchResultData({ itemList: [] }, pageNo, singleTab))
      }
      const result = pageNo === 1 ? searchResultPageData : searchResultPageData2
      return Promise.resolve(buildSearchResultData(result as SearchResult, pageNo, singleTab))
    }

    return requestManager.cmsGet(tabContentUrl() + `&wd=${keyword}&pg=${pageNo}&pagesize=${pageSize}`)
      .then((result: any) => buildSearchResultData({
        itemList: result.list?.map(item => ({
          id: item.vod_id,
          title: item.vod_name,
          poster: item.vod_pic,
          corner: '',
          actionRedirect: {
            redirectType: 1,
            innerArgs: getInnerArgs(item.vod_id)
          }
        }))
      }, pageNo, singleTab))
  }

  function getRecommendPageData(tabId: string, pageNo: number, pageSize: number, singleTab: boolean): Promise<QTTabPageData> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData) {
      if (pageNo === 3) { //模拟结束
        return Promise.resolve(buildSearchResultData({ itemList: [] }, pageNo, singleTab))
      }
      const result = pageNo === 1 ? searchRecommendResultData : searchResultPageData2
      return Promise.resolve(buildSearchResultData(result as SearchResult, pageNo, singleTab))
    }

    return requestManager.cmsGet(tabContentUrl() + `&pg=${pageNo}&pagesize=${pageSize}`)
      .then((result: any) => buildSearchResultData({
        itemList: result.list?.map(item => ({
          id: item.vod_id,
          title: item.vod_name,
          poster: item.vod_pic,
          corner: '',
          actionRedirect: {
            redirectType: 1,
            innerArgs: getInnerArgs(item.vod_id)
          }
        }))
      }, pageNo, singleTab))
  }

  /********************************筛选相关*****************************/
  async function getScreenLeftTags(screenId: string) {
    let tabs = await getTabList()
    let now = new Date()
    let years: any = []
    for (let i = 0; i < 10; i++) {
      years.push({
        tagName: now.getFullYear() - i,
        showName: now.getFullYear() - i
      })
    }
    return Promise.resolve({
      entryTag: {
        id: '',
        tagName: '',
        showName: '',
        showType: '1'
      },
      tags: [],
      status: 1,
      filterList: [
        {
          allName: '全部',
          tags: tabs.itemList.map(item => ({
            tagName: item._id,
            showName: item.text
          }))
        },
        {
          allName: '全部',
          tags: years
        },
        {
          allName: '全部',
          tags: [
            {
              tagName: 1,
              showName: '已完结'
            },
            {
              tagName: 0,
              showName: '未完结'
            }
          ]
        },
        {
          allName: '全部',
          tags: [
            {
              tagName: 24,
              showName: '24小时'
            },
            {
              tagName: 48,
              showName: '48小时'
            },
            {
              tagName: 72,
              showName: '72小时'
            }
          ]
        },
        {
          allName: '全部',
          tags: [
            {
              tagName: '1080zyk',
              showName: '1080zyk'
            }
          ]
        }
      ]
    })

    const requestUrl = filterEntryUrl() + screenId
    return requestManager.post(requestUrl, {})
  }

  async function getScreenContentByTags(pageNum: number, tags?: string) {
    let result = await requestManager.cmsGet(tabContentUrl() + `&pg=${pageNum}&pagesize=${FilterConfig.screenPageSize}` + tags)
    return Promise.resolve(result.list.map(item => ({
      id: '',
      assetTitle: item.vod_name,
      doubanScore: item.vod_score,
      coverV: item.vod_pic,
      actionRedirect: {
        redirectType: 1,
        innerArgs: getInnerArgs(item.vod_id)
      }
    })))

    const params = requestManager.getParams()
    const pageParams = {
      "pageNo": pageNum,
      "pageSize": FilterConfig.screenPageSize,
    };
    const newParams = { ...params, ...pageParams };
    return requestManager.post(filterContentUrl(), {
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
