import { ESPlayerDefinition } from "@extscreen/es3-player"
import FilterConfig from "../pages/filter/build_data/FilterConfig";
import bg_play from "./home/mock/bg_play";
import { IGlobalApi } from "./IGlobalApi";
import { RequestManager } from "./request/RequestManager";
import { QTTab, QTTabPageData, QTTabItem, QTWaterfallItem } from "@quicktvui/quicktvui3";
import { Tab } from "../pages/home/build_data/tab/impl/Tab";
import tabMockJson from "./home/mock/home_tab";
import {
  buildTransferTabAdapter,
  getTabBackground,
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
} from "./RequestUrl";
import {
  buildO2MTabContentData,
  buildO2MTabData,
  buildHomeShortVideoAdapter,
  buildHomeMultilevelTabAdapter,
  build4KWorldAdapter,
  buildHomeShortVideo2Adapter
} from "../pages/home/build_data/useTabData"

/*****
 ***************搜索 *********
 *****/
import {
  buildSearchCenterListData,
  buildSearchResultData,
  buildSearchTabData,
} from "../pages/search/build_data/useSearchData";
import searchCenterList from "./search/mock/search_center_list";
import searchResultTabList from "./search/mock/search_result_tab_list";
import searchRecommendTabList from "./search/mock/search_recommend_tab";
import searchResultPageData from "./search/mock/search_result_page_data";
import searchResultPageData2 from "./search/mock/search_result_page_data2";
import searchRecommendResultData from "./search/mock/search_result_recommend_data";
import SearchConfig from "../pages/search/build_data/SearchConfig";
import { SearchCenter } from "../pages/search/build_data/impl/SearchCenter";
import { SearchTab } from "../pages/search/build_data/impl/SearchTab";
import { SearchResult } from "../pages/search/build_data/impl/SearchResult";

/***** *************** 短视频 **************/
import { buildMultilevelTabItemAdapter, buildShortVideoItemAdapter } from "../pages/shortVideo/build_data/adapter";
import { ShortVideoItem } from "../pages/shortVideo/build_data/interface";
import shortVideoList from "./shortVideo/mock/short_video_data";
import { leftExpand, leftTags } from "./filter/mock";

export function createGlobalApi(): IGlobalApi {
  let requestManager: RequestManager;
  function init(...params: any[]): Promise<any> {
    requestManager = params[0];
    return Promise.resolve();
  }

  function getTabList(): Promise<QTTab> {
    //使用本地数据
    if (BuildConfig.useMockData) {
      return getMockTabList();
    }
    return requestManager.post(tabListUrl, {}).then((tabList: Array<any>) => {
      return buildO2MTabData(tabList);
    });
  }

  function getMockTabList(): Promise<QTTab> {
    const tabs: Array<Tab> = tabMockJson as Array<Tab>;
    return Promise.resolve(buildTransferTabAdapter(tabs));
  }

  function getTabContent(
    tabId: string,
    pageNo: number,
    pageSize: number,
    tabPageIndex?: number
  ): Promise<QTTabPageData> {
    if(tabId == 'short_video' && pageNo < 2) {
      let tabPage = buildHomeShortVideoAdapter(tabId,tabPageIndex)
      tabPage.data[0].itemList = buildShortVideoItemAdapter(shortVideoList)
      return Promise.resolve(tabPage);
    } else if (tabId === 'multilevelTab' && pageNo < 2) {
      let tabPage = buildHomeMultilevelTabAdapter(tabId, tabPageIndex)
      tabPage.data[0].itemList = buildMultilevelTabItemAdapter(shortVideoList.slice(0, 5))
      return Promise.resolve(tabPage)
    }else if(tabId === "4k_world" && pageNo < 2){
      let tabPage = build4KWorldAdapter(tabId, tabPageIndex)
      return Promise.resolve(tabPage)
    }else if(tabId === 'short_video2' && pageNo < 2){
      let tabPage = buildHomeShortVideo2Adapter(tabId,tabPageIndex)
      tabPage.data[0].itemList = buildShortVideoItemAdapter(shortVideoList)
      return Promise.resolve(tabPage);
    }
    //此处可更换接口请求数据
    if (BuildConfig.useMockData) {
      return getMockTabContent(tabId, pageNo, tabPageIndex);
    }
    return requestManager
      .post(tabContentUrl, {
        data: tabId,
        param: {
          isSupportPage: 1,
          pageNo: pageNo,
          pageSize: pageSize,
        },
      })
      .then((tabContent: any) => {
        return buildO2MTabContentData(tabContent, pageNo, tabId, tabPageIndex);
      });
  }

  function getMockTabContent(
    tabId: string,
    pageNo: number,
    tabPageIndex?: number
  ): Promise<QTTabPageData> {
    const name: Array<any> = [
      tabPage0MockJson,
      tabPage1MockJson,
      tabPage2MockJson,
      tabPage3MockJson,
    ];
    const index = Number(tabId);
    return Promise.resolve(
      buildTransferTabContentAdapter(name[index], pageNo, tabId, tabPageIndex)
    );
  }

  function getTabBg(tabId): string {
    return getTabBackground(tabId);
  }

  function getHomeBgVideoAssetsUrl(id: string): Promise<object> {
    //todo 实现获取播放地址接口
    const urls = bg_play;
    return Promise.resolve({
      url: urls[id],
      definition:ESPlayerDefinition.ES_PLAYER_DEFINITION_SD
    });
  }

  //***************************************************搜索相关***************
  function getHotSearch(pageNum: number, keyword?: string): Promise<SearchCenter> {
    if (BuildConfig.useMockData) {
      let list: Array<any> = [];
      if (searchCenterList.keywordList.length > 0) list = searchCenterList.keywordList;
      const isLoadHistory = searchCenterList.historyList.length > 0;
      if (isLoadHistory) list = searchCenterList.historyList;
      return Promise.resolve(buildSearchCenterListData(list, isLoadHistory));
    }
    // 根据keyword字母搜索关键字 不传返回热门搜索
    return requestManager
      .post(hotSearchUrl, {
        data: keyword,
        param: { pageNo: pageNum, pageSize: SearchConfig.searchCenterPageSize },
      })
      .then((result: any) => {
        let list: Array<any> = [];
        if (result.keywordList.length > 0) list = result.keywordList;
        if (result.historyList.length > 0) list = result.historyList;
        return buildSearchCenterListData(list, result.historyList.length > 0);
      });
  }

  function clearHistory(): void {}

  function getSearchResultTabList(isHotRecommend: boolean): Promise<Array<QTTabItem>> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData || true) {
      if (isHotRecommend) {
        return Promise.resolve(buildSearchTabData(searchRecommendTabList as Array<SearchTab>));
      } else {
        return Promise.resolve(buildSearchTabData(searchResultTabList as Array<SearchTab>));
      }
    }
  }

  function getSearchResultPageData(
    tabId: string,
    pageNo: number,
    pageSize: number,
    singleTab: boolean
  ): Promise<QTTabPageData> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData || true) {
      if (pageNo === 20) {
        //模拟结束
        return Promise.resolve(buildSearchResultData({ itemList: [] }, pageNo, singleTab));
      }
      const result = pageNo === 19 ? searchResultPageData2 : searchResultPageData;
      return Promise.resolve(buildSearchResultData(result as SearchResult, pageNo, singleTab));
    }
  }

  function getRecommendPageData(
    tabId: string,
    pageNo: number,
    pageSize: number,
    singleTab: boolean
  ): Promise<QTTabPageData> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData || true) {
      if (pageNo === 3) {
        //模拟结束
        return Promise.resolve(buildSearchResultData({ itemList: [] }, pageNo, singleTab));
      }
      const result = pageNo === 1 ? searchRecommendResultData : searchResultPageData2;
      return Promise.resolve(buildSearchResultData(result as SearchResult, pageNo, singleTab));
    }
  }

  /********************************筛选相关*****************************/
  function getScreenLeftExpand(): Promise<any> {
    return Promise.resolve(leftExpand);
  }

  function getScreenLeftTags(screenId: string) {
    return Promise.resolve(leftTags[screenId] ?? {});
    const requestUrl = filterEntryUrl + screenId;
    return requestManager.post(requestUrl, {});
  }

  function getScreenContentByTags(tags, pageNum) {
    const params = requestManager.getParams();
    const pageParams = {
      pageNo: pageNum,
      pageSize: FilterConfig.screenPageSize,
    };
    const newParams = { ...params, ...pageParams };
    return requestManager.post(filterContentUrl, {
      param: newParams,
      data: tags,
    });
  }

  /********************************短视频相关*****************************/
  function getShortVideoPageData(keyword: string, pageNo: number, pageSize: number): Promise<Array<QTWaterfallItem>> {
    //此处可更换接口请求数据
    if (BuildConfig.useMockData || true) {
      if (pageNo > 2) {
        //模拟结束
        return Promise.resolve(buildShortVideoItemAdapter([]));
      }
      return Promise.resolve(buildShortVideoItemAdapter(shortVideoList));
    }
  }

  /********************************多级Tab相关*****************************/
  function getMultilevelTabPageData(keyword: string, pageNo: number, pageSize: number): Promise<Array<QTWaterfallItem>> {
    console.log('huan-xxx', pageNo, pageSize)
    //此处可更换接口请求数据
    if (BuildConfig.useMockData || true) {
      if (pageNo > 2) {
        //模拟结束
        return Promise.resolve(buildMultilevelTabItemAdapter([]));
      }
      return Promise.resolve(buildMultilevelTabItemAdapter(shortVideoList.slice((pageNo-1)*pageSize, pageNo*pageSize)));
    }
  }

  return {
    install: function (app: ESApp) {
      const instance = this;
      app.provide(GlobalApiKey, instance);
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
    getScreenLeftExpand,
    getScreenLeftTags,
    getScreenContentByTags,
    getShortVideoPageData,
    getMultilevelTabPageData
  };
}
