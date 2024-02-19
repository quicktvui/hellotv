import {QTTabPageData, QTTabItem,QTListViewItem} from "@quicktvui/quicktvui3";

export interface ISearchDataSource {
    getHotSearch(keyword?: string): Promise<Array<QTListViewItem>>

    getSearchResultTabList(): Promise<Array<QTTabItem>>

    getSearchResultPageData(pageNo: number, pageSize: number, keyword: string, title?: string): Promise<QTTabPageData>
}

