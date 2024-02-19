// 银河筛选页频道
export type IChannel = {
    chnId: string
    chnName: string
}

// 银河筛选页标签组
export type ITagGroup = {
    id: number
    name: string
    tags: ITag[]
}

// 银河筛选页标签
export type ITag = {
    cpTagId: string
    tagName: string
    showOrder: number
}

// 银河筛选排序类型
export type ISortType = {
    tagName: string
    tagSearchType: string
}

// 银河筛选搜索参数
export type ISearchOption = {
    pageNo?: number
    pageSize?: number
    chnId?: number
    keyword?: string
    initialChar?: string
    tags?: string
    tagSearchType?: number
}

// 银河筛选搜索响应
export type ISearchResponse = {
    album: {
        total: number
        showTotalCount: number
        pageNo: number
        pageSize: number
        list: ISearchAlbumItem[]
    }
}

// 银河筛选搜索响应·专辑
export type ISearchAlbumItem = {
    albumName: string
    sets: number
    currShowPlayOrder: any[]
    cpId: number
    contentId: string
    focus: string
    is3d: number
    superScripts: any[]
    pic: string
    maxSet: number
    actors: string
    picUrl: string
    score: number
    contentType: number
    corner: string
}

// 银河角标
export type ICorner = {
    picUrl: string // 角标图片
    scriptLibId: number
    superscriptId: number // 角标ID
    showOrder: number
    position: number
    version: number
}
