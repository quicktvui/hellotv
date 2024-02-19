import {IBaseApi} from "./IBaseApi";
import {IHomeDataSource} from "./home/IHomeDataSource";
import {ISearchDataSource} from "./search/ISearchDataSource";
export interface IGlobalApi extends IBaseApi,IHomeDataSource,ISearchDataSource{


}
