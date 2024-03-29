import { IGlobalApi } from "./IGlobalApi";
import { RequestManager } from "./request/RequestManager";
import { QTTab, QTTabPageData, QTListViewItem, QTTabItem } from "@quicktvui/quicktvui3";
import { Tab } from "../pages/home/build_data/tab/impl/Tab";
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
import { buildTransferTabContentAdapter } from "../pages/home/build_data/tab_content/TabContentTransferAdapter";
import { ESApp } from "@extscreen/es3-vue";
import { GlobalApiKey } from "./UseApi";
import BuildConfig from "../build/BuildConfig";
import {
    filterContentUrl,
    filterEntryUrl,
    hotSearchUrl,
    searchLongUrl,
    tabContentUrl,
    tabListUrl,
    urlSaveHistory, urlGetHistory, urlGetLongHistory, urlGetShortHistory, urlGetBookHistory
} from "./RequestUrl";
import { buildO2MTabContentData, buildO2MTabData } from "../pages/home/build_data/useTabData";
import { TabPlayItem } from "../pages/home/build_data/tab_content/impl/TabPlayItem";
import { buildO2MTabContentData, buildO2MTabData } from "../pages/home/build_data/useTabData";
import { TabPlayItem } from "../pages/home/build_data/tab_content/impl/TabPlayItem";

/*****
  ***************搜索 *********
*****/
import { buildSearchCenterListData, buildSearchResultTabListData, buildSearchResultPageData } from "../pages/search/build_data/useSearchData";
import searchCenterList from "./search/mock/search_center_list";
import searchResultTabList from "./search/mock/search_result_tab_list";
import searchResultPageData from "./search/mock/search_result_page_data";
import SearchConfig from "../pages/search/build_data/SearchConfig"
import { SearchCenter } from "../pages/search/build_data/impl/SearchCenter"
import { IScreenDataTags } from "./filter/IScreenDataSource";
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
            .then((result: any) => buildO2MTabData(result.class))
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
        return requestManager.cmsGet(tabContentUrl + `&t=${tabId}&pg=${pageNo}&pagesize=${pageSize * 6}`)
            .then(async (result: any) => buildO2MTabContentData(result, pageNo, tabId))
    }

    function getMockTabContent(tabId: string, pageNo: number,): Promise<QTTabPageData> {
        const name: Array<any> = [tabPage0MockJson, tabPage1MockJson, tabPage2MockJson, tabPage3MockJson]
        const index = Number(tabId)
        return Promise.resolve(buildTransferTabContentAdapter(name[index], pageNo, tabId))
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
    function getHotSearch(pageNum: number, keyword?: string): Promise<SearchCenter> {
        if (BuildConfig.useMockData) {
            let list: Array<any> = []
            if (searchCenterList.keywordList.length > 0) list = searchCenterList.keywordList
            if (searchCenterList.historyList.length > 0) list = searchCenterList.historyList
            return Promise.resolve(buildSearchCenterListData(list, searchCenterList.historyList.length > 0))
        }
        // 根据keyword字母搜索关键字 不传返回热门搜索
        return requestManager.post(hotSearchUrl, { 'data': keyword, param: { pageNo: pageNum, pageSize: SearchConfig.screenCenterPageSize } })
            .then((result: any) => {
                let list: Array<any> = []
                if (result.keywordList.length > 0) list = result.keywordList
                if (result.historyList.length > 0) list = result.historyList
                return buildSearchCenterListData(list, result.historyList.length > 0)
            })
    }

    function clearHistory(): void {

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

        return requestManager.cmsGet(tabContentUrl + `&wd=${keyword}&pg=${pageNo}`)
            .then((result: any) => buildSearchResultPageData(pageNo, result.list))

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

        const requestUrl = filterEntryUrl + screenId
        return requestManager.post(requestUrl, {})
    }

    async function getScreenContentByTags(pageNum: number, tags?: IScreenDataTags) {
        let result = await requestManager.cmsGet(tabContentUrl + `&pg=${pageNum}&pagesize=${SearchConfig.screenPageSize}` + tags)
        return Promise.resolve(result.list.map(item => ({
            id: '',
            assetTitle: item.vod_name,
            doubanScore: item.vod_score,
            coverV: item.vod_pic,
            actionRedirect: {
                redirectType: 1,
                innerArgs: JSON.stringify({
                    params: {
                        mediaId: item.vod_id,
                        episodeId: 0,
                        episodeIndex: 0,
                        startPosition: 0
                    },
                    url: 'series_view'
                })
            }
        })))

        const params = requestManager.getParams()
        const pageParams = {
            "pageNo": pageNum,
            "pageSize": SearchConfig.screenPageSize,
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
        clearHistory,
        getSearchResultTabList,
        getSearchResultPageData,
        getScreenLeftTags,
        getScreenContentByTags
    }
}
