import {QTTabPageData, QTTabItem} from "@quicktvui/quicktvui3";
import { SearchCenter } from "../../pages/search/build_data/impl/SearchCenter"

export interface ISearchDataSource {
    getHotSearch(pageNum: number,keyword?: string): Promise<SearchCenter>

    clearHistory():void

    getSearchResultTabList(): Promise<Array<QTTabItem>>

    getSearchResultPageData(pageNo: number, pageSize: number, keyword: string, title?: string): Promise<QTTabPageData>
}

