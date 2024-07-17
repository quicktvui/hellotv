import { IBaseApi } from "./IBaseApi";
import { IHomeDataSource } from "./home/IHomeDataSource";
import { ISearchDataSource } from "./search/ISearchDataSource";
import { IScreenDataSource } from "./filter/IScreenDataSource";
import { IShortVideoDataSource } from "./shortVideo/IShortVideoDataSource";
export interface IGlobalApi extends IBaseApi, IHomeDataSource, ISearchDataSource, IScreenDataSource, IShortVideoDataSource {


}
