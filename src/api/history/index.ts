import { urlGetBookHistory, urlGetHistory, urlGetLongHistory, urlGetShortHistory } from "../RequestUrl";
import { IMedia } from "../media/IMedia";
import { HistoryBaseApi, IcurrentItemParams } from "./baseApi";
import { IHistoryMenuDto, IHistoryFilterDto, IHistoryContentDto, IHistoryMenuEntity, IHistoryContentEntity } from "./modelEntity"
import { delPlyHistory, localHistory, historyKey, historyToCategory, plyHistoryCategory, favHistoryCategory } from "./store";

class HistoryApi extends HistoryBaseApi {
    init(...params: any[]): Promise<any> {
        this.requestManager = params[0]
        this.localStore = params[1]
        return Promise.resolve()
    }

    // async getMenuList(): Promise<IHistoryMenuDto> {
    //     return {}
    // }

    async getFilterTabList(index: number, category: IHistoryMenuEntity): Promise<IHistoryFilterDto> {
        return { data: historyToCategory(index == 0 ? 'ply' : 'fav') }
    }

    async getContentList(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, pageNum: number): Promise<IHistoryContentDto> {
        console.log('huan-playHistory', localHistory, currentFilter)

        let data: IHistoryContentEntity[] = []
        switch (currentMenu.index) {
            case 0: // 观看历史
                plyHistoryCategory[currentFilter.item.id].map((item: IMedia) => data.push({
                    assetLongTitle: item.title || '',
                    assetLongCoverH: item.coverH,
                    description1: '',
                    metaId: item.id,
                    playCount: item.playIndex || 0,
                    currentPlayTime: item.progress
                }))
                break
            case 1: // 我的收藏
                favHistoryCategory[currentFilter.item.id].map((item: IMedia) => data.push({
                    assetLongTitle: item.title || '',
                    assetLongCoverH: item.coverH,
                    description1: '',
                    metaId: item.id,
                    playCount: item.playIndex || 0,
                    currentPlayTime: item.progress
                }))
                break
        }

        return Promise.resolve({
            page: pageNum,
            size: data.length,
            data: data
        })
    }

    async deleteContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, id: number) {
        switch (currentMenu.index) {
            case 0: // 观看历史
                if (delPlyHistory(id)) {
                    console.log('huan-删除啦', localHistory.ply)
                    await this.localStore.putString(historyKey, JSON.stringify(history))
                }
                break
        }
    }

    clearContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams): void {

    }
}

export default new HistoryApi()
