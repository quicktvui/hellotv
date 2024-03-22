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
    mediaDetailUrl,
    searchLongUrl,
    tabContentUrl,
    tabListUrl
} from "./RequestUrl";
import { buildO2MTabContentData, buildO2MTabData } from "../pages/home/build_data/useTabData";
import { TabPlayItem } from "../pages/home/build_data/tab_content/impl/TabPlayItem";

/*****
  ***************搜索 *********
*****/
import { buildSearchCenterListData, buildSearchResultTabListData, buildSearchResultPageData } from "../pages/search/build_data/useSearchData";
import searchCenterList from "./search/mock/search_center_list";
import searchResultTabList from "./search/mock/search_result_tab_list";
import searchResultPageData from "./search/mock/search_result_page_data";
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
        return requestManager.cmsGet(tabListUrl)
            .then((result: any) => {
                return buildO2MTabData(result.class)
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
        return requestManager.cmsGet(tabContentUrl + `&t=${tabId}&pg=${pageNo}`)
            .then(async (result: any) => {

                // 补充详情数据
                let ids: string[] = []
                result.list?.map((item: any) => ids.push(item.vod_id))
                if (ids.length > 0) {
                    result.details = await getTabContentDetails(ids.join(','), 1)
                }

                return buildO2MTabContentData(result, pageNo, tabId)
            })
    }

    function getMockTabContent(tabId: string, pageNo: number,): Promise<QTTabPageData> {
        const name: Array<any> = [tabPage0MockJson, tabPage1MockJson, tabPage2MockJson, tabPage3MockJson]
        const index = Number(tabId)
        return Promise.resolve(buildTransferTabContentAdapter(name[index], pageNo == 1, tabId))
    }

    function getTabContentDetails(ids: string, pageNo: number): Promise<any> {
        return requestManager.cmsGet(mediaDetailUrl + `&ids=${ids}&pg=${pageNo}`)
            .then((result: any) => {
                let details = {}
                result.list?.map((item: any) => details[item.vod_id] = item)
                return details
            })
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
            url: "http://qcloudcdn.a311.ottcn.com/channelzero/2022/01/04/e6693388-4867-47d7-ba5d-e21ef66e744c_transcode_1137857.m3u8",
            isRequestUrl: false
        })
    }

    //***************************************************搜索相关***************
    function getHotSearch(keyword?: string): Promise<Array<QTListViewItem>> {
        if (BuildConfig.useMockData) return Promise.resolve(buildSearchCenterListData(searchCenterList))
        // 根据keyword字母搜索关键字 不传返回热门搜索
        return requestManager.post(hotSearchUrl, { 'data': keyword, param: { pageNo: 1, pageSize: 20 } })
            .then((result: any) => {
                let list: Array<any> = []
                if (result.keywordList.length > 0) list = result.keywordList
                if (result.historyList.length > 0) list = result.historyList
                return buildSearchCenterListData(list)
            })
    }

    function getSearchResultTabList(): Promise<Array<QTTabItem>> {
        //此处可更换接口请求数据
        if (BuildConfig.useMockData) return Promise.resolve(buildSearchResultTabListData(searchResultTabList))
        return requestManager.post(tabContentUrl, { 'data': '' })
            .then((searchCenterList: any) => {
                return buildSearchResultTabListData(searchResultTabList)
            })
    }

    function getSearchResultPageData(pageNo: number, pageSize: number, keyword: string, title?: string): Promise<QTTabPageData> {
        //此处可更换接口请求数据
        if (BuildConfig.useMockData) {
            if (pageNo == 3) return Promise.resolve(buildSearchResultPageData(pageNo, [], title))
            else return Promise.resolve(buildSearchResultPageData(pageNo, searchResultPageData, title))
        }
        return requestManager.post(searchLongUrl, {
            "data": keyword,
            'param': {
                "pageNo": pageNo,
                "pageSize": pageSize
            }
        }).then((tabContent: any) => {
            console.log(tabContent, '888888888888')
            return buildSearchResultPageData(pageNo, tabContent, title)
        }).catch(() => buildSearchResultPageData(pageNo, [], title))
    }

    /********************************筛选相关*****************************/
    function getScreenLeftTags(screenId: string) {
        const requestUrl = filterEntryUrl + screenId
        return requestManager.post(requestUrl, {})
    }

    function getScreenContentByTags(tags, pageNum) {
        const params = requestManager.getParams()
        const pageParams = {
            "pageNo": pageNum,
            "pageSize": 20,
        };
        const newParams = { ...params, ...pageParams };
        return requestManager.post(filterContentUrl, {
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
        getSearchResultTabList,
        getSearchResultPageData,
        getScreenLeftTags,
        getScreenContentByTags
    }
}
