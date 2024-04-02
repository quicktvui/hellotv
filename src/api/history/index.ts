import { urlGetBookHistory, urlGetHistory, urlGetLongHistory, urlGetShortHistory } from "../RequestUrl";
import { HistoryBaseApi, IcurrentItemParams } from "./baseApi";
import { IHistoryMenuDto, IHistoryFilterDto, IHistoryContentDto, IHistoryMenuEntity } from "./modelEntity"

class HistoryApi extends HistoryBaseApi {
    init(...params: any[]): Promise<any> {
        this.requestManager = params[0]
        return Promise.resolve()
    }
    // async getMenuList(): Promise<IHistoryMenuDto> {
    //     return {}
    // }
    // async getFilterTabList(index:number, category:IHistoryMenuEntity): Promise<IHistoryFilterDto> {
    //     return {}
    // }
    async getContentList(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, pageNum: number): Promise<IHistoryContentDto> {
        if (currentMenu.index === 0 && currentFilter.index === 0) {
            return this.requestManager.post(urlGetHistory, {
                param: { "pageNo": pageNum, "pageSize": 20, }
            }).then(res => {
                return { data: res }
            }).catch(err => {
                console.log('-----lsj------', err)
                return {}
            })
        }
        if (currentMenu.index === 0 && currentFilter.index === 1) {
            return this.requestManager.post(urlGetLongHistory, {
                param: { "pageNo": pageNum, "pageSize": 20, }
            }).then(res => {
                return { data: res }
            }).catch(err => {
                console.log('-----lsj------', err)
                return {}
            })
        }
        if (currentMenu.index === 0 && currentFilter.index === 2) {
            return this.requestManager.post(urlGetShortHistory, {
                param: { "pageNo": pageNum, "pageSize": 20, }
            }).then(res => {
                return { data: res }
            }).catch(err => {
                console.log('-----lsj------', err)
                return {}
            })
        }
        if (currentMenu.index === 0 && currentFilter.index === 3) {
            return this.requestManager.post(urlGetBookHistory, {
                param: { "pageNo": pageNum, "pageSize": 20, }
            }).then(res => {
                return { data: res }
            }).catch(err => {
                console.log('-----lsj------', err)
                return {}
            })
        }
        return {}
    }
    // async deleteContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, item:IcurrentItemParams): Promise<boolean> {
    //     return true
    // }
    // async clearContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams): Promise<boolean> {
    //     return true
    // }
}

export default new HistoryApi()