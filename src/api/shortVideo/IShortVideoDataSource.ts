import {QTWaterfallItem} from "@quicktvui/quicktvui3";
import { SearchCenter } from "../../pages/search/build_data/impl/SearchCenter"

export interface IShortVideoDataSource {
  getShortVideoPageData(keyword:string,pageNo: number, pageSize: number): Promise<Array<QTWaterfallItem>>
  getMultilevelTabPageData(keyword:string,pageNo: number, pageSize: number): Promise<Array<QTWaterfallItem>>
}
