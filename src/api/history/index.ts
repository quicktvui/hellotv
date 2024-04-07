import { IMedia } from "../media/IMedia";
import { HistoryBaseApi, IcurrentItemParams } from "./baseApi";
import { IHistoryFilterDto, IHistoryContentDto, IHistoryMenuEntity, IHistoryContentEntity, IHistoryMenuDto } from "./modelEntity"
import { localHistory, historyKey, historyToCategory, plyHistoryCategory, favHistoryCategory, removeHistory, resetHistory } from "./store";

class HistoryApi extends HistoryBaseApi {
  init(...params: any[]): Promise<any> {
    this.requestManager = params[0]
    this.localStore = params[1]
    return Promise.resolve()
  }

  async getMenuList(): Promise<IHistoryMenuDto> {
    return {
      data: [
        {
          id: 0,
          name: '观看历史',
          type: 1//1文字，2图标+文字，3图片
        },
        {
          id: 1,
          name: '我的收藏',
          type: 1//1文字，2图标+文字，3图片
        }
      ]
    }
  }

  async getFilterTabList(index: number, category: IHistoryMenuEntity): Promise<IHistoryFilterDto> {
    return { data: historyToCategory(index == 0 ? 'ply' : 'fav') }
  }

  async getContentList(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, pageNum: number): Promise<IHistoryContentDto> {
    console.log('huan-getContentList', currentMenu, currentFilter, pageNum, localHistory)

    let data: IHistoryContentEntity[] = []
    switch (currentMenu.index) {
      case 0: // 观看历史
        plyHistoryCategory[currentFilter.item.id].slice(--pageNum * 15, ++pageNum * 15).map((item: IMedia) => data.push({
          assetType: item.typeId,
          assetLongTitle: item.title || '',
          assetLongCoverH: item.coverH,
          description1: '',
          id: item.id,
          metaId: item.id,
          playCount: item.playId || 0,
          currentPlayTime: item.progress,
          allTime: Number(item.duration || 0) * 60 * 1000,
          customProp: {
            fullIndex: item.fullIndex,
            currIndex: item.currIndex
          }
        }))
        break
      case 1: // 我的收藏
        favHistoryCategory[currentFilter.item.id].slice(--pageNum * 15, ++pageNum * 15).map((item: IMedia) => data.push({
          assetType: item.typeId,
          assetLongTitle: item.title || '',
          assetLongCoverH: item.coverH,
          description1: '',
          id: item.id,
          metaId: item.id,
          playCount: item.playId || 0,
          customProp: {
            fullIndex: item.fullIndex,
            currIndex: item.currIndex
          }
        }))
        break
    }

    console.log('huan-', pageNum, data)

    return Promise.resolve({
      page: pageNum,
      size: data.length,
      data: data
    })
  }

  async deleteContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, item: IcurrentItemParams): Promise<boolean> {
    console.log('huan-deleteContent', currentMenu, currentFilter, item)

    switch (currentMenu.index) {
      case 0: // 历史
        delete plyHistoryCategory[0][item.item.customProp.fullIndex]
        delete plyHistoryCategory[item.item.metaType][item.item.customProp.currIndex]
        break
      case 1: // 收藏
        delete favHistoryCategory[0][item.item.customProp.fullIndex]
        delete favHistoryCategory[item.item.metaType][item.item.customProp.currIndex]
        break
    }

    if (removeHistory(currentMenu.index == 0 ? 'ply' : 'fav', Number(item.item.id))) {
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
