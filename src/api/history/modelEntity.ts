// Entity-实体类
export interface IHistoryMenuEntity {
    id: number
    name: string
    type: number//1文字，2图标+文字，3图片
    img?: string//图片地址
    focusedImg?: string
    selectedImg?: string
}
export interface IHistoryFilterEntity {
    id: number
    name: string
}
export interface IHistoryContentEntity {
    assetId?: string
    assetLongCoverH?: string//图片
    assetLongId?: string
    assetLongTitle: string//标题
    assetType?: string
    currentPlayTime?: string
    description1: string//浮动标题
    id?: string
    metaId?: string
    payType?: string
    platformId?: string
    playCount?: string
    playTime?: string
    userId?: string
    // mark?: string//角标
    h_mode?: string//模式-列表项/分类
    h_modeName?: string
}

// Dto
export interface IHistoryMenuDto {
    code?: number
    data?: IHistoryMenuEntity[]
}
export interface IHistoryFilterDto {
    code?: number
    data?: IHistoryFilterEntity[]
}
export interface IHistoryContentDto {
    code?: number;
    page?: number;
    size?: number;
    data?: IHistoryContentEntity[]
}