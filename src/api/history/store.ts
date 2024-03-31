import { IHistoryFilterEntity } from "./modelEntity"

export const historyKey = 'cms-history'
export interface History {
    // 播放历史
    ply: {}
    // 我的收藏
    fav: {}
}

export let localHistory: History = {
    ply: {}, fav: {}
}

export let plyHistoryCategory = {}
export let favHistoryCategory = {}

export function loadHistory(val: History) {
    localHistory = val
}

export function removeHistory(type: 'ply' | 'fav', id: number): boolean {
    return delete (localHistory[type][id])
}

export function resetHistory(type: 'ply' | 'fav') {
    localHistory[type] = {}
}

export function historyToCategory(type: 'ply' | 'fav') {
    switch (type) {
        case 'ply':
            plyHistoryCategory = { 0: [] }
            return handle(localHistory.ply, true)
        case 'fav':
            favHistoryCategory = { 0: [] }
            return handle(localHistory.fav, false)
    }
}

function handle(obj: {}, isPly: Boolean): IHistoryFilterEntity[] {
    let target = isPly ? plyHistoryCategory : favHistoryCategory
    for (const [_, val] of Object.entries(obj)) {
        // @ts-ignore
        target[0].push(val)
        // @ts-ignore
        target[val.typeId] ? target[val.typeId].push(val) : target[val.typeId] = [val]
    }

    let arr: IHistoryFilterEntity[] = [{ id: 0, name: '全部' }]
    for (const [key, val] of Object.entries(target)) {
        if (key == '0') {
            continue
        }
        arr.push({
            id: Number(key),
            // @ts-ignore
            name: val[0].typeName
        })
    }

    return arr
}
