import {QTTabPageData, QTTabItem} from "@quicktvui/quicktvui3";
import { SearchCenter } from "../../pages/search/build_data/impl/SearchCenter"

export interface ISearchDataSource {
    getHotSearch(pageNum: number,keyword?: string): Promise<SearchCenter>

    clearHistory():void

    getSearchResultTabList(isHotRecommend:boolean): Promise<Array<QTTabItem>>

    getSearchResultPageData(tabId:string,pageNo: number, pageSize: number,singleTab:boolean): Promise<QTTabPageData>


    getRecommendPageData(tabId:string,pageNo: number, pageSize: number,singleTab:boolean): Promise<QTTabPageData>
}

