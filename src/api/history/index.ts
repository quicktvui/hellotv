import { IMedia } from "../media/IMedia";
import { HistoryBaseApi, IcurrentItemParams } from "./baseApi";
import { IHistoryFilterDto, IHistoryContentDto, IHistoryMenuEntity, IHistoryContentEntity } from "./modelEntity"
import { localHistory, historyKey, historyToCategory, plyHistoryCategory, favHistoryCategory, removeHistory, resetHistory } from "./store";

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
        console.log('huan-getContentList', currentMenu.index, currentFilter.item.id, pageNum, localHistory)
        let data: IHistoryContentEntity[] = []
        switch (currentMenu.index) {
            case 0: // 观看历史
                plyHistoryCategory[currentFilter.item.id].slice(--pageNum * 15, ++pageNum * 15).map((item: IMedia) => data.push({
                    assetLongTitle: item.title || '',
                    assetLongCoverH: item.coverH,
                    description1: '',
                    metaId: item.id,
                    playCount: item.playId || 0,
                    currentPlayTime: item.progress,
                    allTime: Number(item.duration || 0) * 60 * 1000
                }))
                break
            case 1: // 我的收藏
                favHistoryCategory[currentFilter.item.id].slice(--pageNum * 15, ++pageNum * 15).map((item: IMedia) => data.push({
                    assetLongTitle: item.title || '',
                    assetLongCoverH: item.coverH,
                    description1: '',
                    metaId: item.id,
                }))
                break
        }

        return Promise.resolve({
            page: pageNum,
            size: data.length,
            data: data
        })
    }

    async deleteContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, id: number): Promise<boolean> {
        if (removeHistory(currentMenu.index == 0 ? 'ply' : 'fav', id)) {
            return await this.localStore.putString(historyKey, JSON.stringify(localHistory))
        }
        return false
    }

    async clearContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams): Promise<boolean> {
        resetHistory(currentMenu.index == 0 ? 'ply' : 'fav')
        return await this.localStore.putString(historyKey, JSON.stringify(localHistory))
    }
}

export default new HistoryApi()
