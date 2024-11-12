import { HistoryBaseApi, IcurrentItemParams } from "./baseApi";
import { IHistoryMenuDto, IHistoryFilterDto, IHistoryContentDto, IHistoryMenuEntity } from "./modelEntity"

class HistoryApi extends HistoryBaseApi {
    init(...params: any[]): Promise<any> {
        return Promise.resolve()
    }
    // async getMenuList(): Promise<IHistoryMenuDto> {
    //     return {}
    // }
    // async getFilterTabList(index:number, category:IHistoryMenuEntity): Promise<IHistoryFilterDto> {
    //     return {}
    // }
    // async getContentList(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, pageNum: number): Promise<IHistoryContentDto> {
    //     return {}
    // }
    // async deleteContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, item:IcurrentItemParams): Promise<boolean> {
    //     return true
    // }
    // async clearContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams): Promise<boolean> {
    //     return true
    // }
}

export default new HistoryApi()
