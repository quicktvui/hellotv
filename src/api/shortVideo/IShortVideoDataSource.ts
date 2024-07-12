// import {QTTabPageData, QTTabItem} from "@quicktvui/quicktvui3";
import { SearchCenter } from "../../pages/search/build_data/impl/SearchCenter"

export interface ISearchDataSource {
    getHotSearch(pageNum: number,keyword?: string): Promise<SearchCenter>
}

