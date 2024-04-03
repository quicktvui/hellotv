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
  let fullIndex = 0
  let currIndex = 0
  for (const [_, val] of Object.entries(obj)) {
    // @ts-ignore
    val.fullIndex = fullIndex++ // 全局索引
    // @ts-ignore
    val.currIndex = ++currIndex // 当前索引
    // @ts-ignore
    target[0].push(val)
    // @ts-ignore
    if (target[val.typeId]) {
      // @ts-ignore
      target[val.typeId].push(val)
    } else {
      currIndex = 0
      // @ts-ignore
      val.currIndex = 0
      // @ts-ignore
      target[val.typeId] = [val]
    }
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
