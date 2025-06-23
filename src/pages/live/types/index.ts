export interface RouteParams {
    url: string
    lives: string
}

export type Lives = Live[]

export interface Live {
    name: string
    type: string
    pass: boolean
    url: string
    epg: string
    logo: string
}

export interface Category {
    name: string
    data: Channel[]
}

export interface Channel {
    // 频道ID
    id: number
    // 频道名称
    name: string
    // 频道播放地址
    addrs: string[]
    // 频道节目列表
    programs?: Program[]
    // 分类索引
    categoryIndex?: number
    // 分类名称
    category?: string
}

export interface Program {
    title?: string
    start?: string
    end?: string
    desc?: string
}
