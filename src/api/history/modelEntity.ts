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
    id: string
    assetId?: string
    assetLongCoverH: string//图片
    assetLongId?: string
    assetLongTitle: string//标题
    subTitle?:string;//副标题，有副标题时取副标题，无副标题时取播放进度playCount+currentPlayTime/allTime
    assetType?: string
    currentPlayTime?: number//当前播放时间-毫秒
    allTime?: number//视频总时间-毫秒
    description1?: string//浮动标题
    metaId: string
    payType?: string
    platformId?: string
    playCount?: string//播放到第几集
    playTime?: string //播放时间(时间戳或2024-03-28 20:43:42格式字符串)，传了此值后，会按时间进行分类
    userId?: string
    // mark?: string//角标
    h_modeName?: string//分类，如果传了此值，则会作为分类名称展示
    customProp?: { //自定义属性，点击内容区列表项时，会把自定义属性中的值原封不动传给接口函数
        [k:string]: any
    } 
    [k:string]: any
}
export interface IHistoryApiEntity {
    classid: string//"1800010005"
    classkeyid: number//2857 分类id
    classname: string//"动画动漫" 板块名称
    creationtime?: number//1717408952000 创建时间
    currentplaytime: number//1 当前播放时间
    id: string;//"337929219"
    musicvideoid: number;//490180 视频id
    musicvideoname: string;//"五灵碎片" 视频名称
    packageid: number;//25953 产品包id
    packagename: string;//"猪猪侠五灵卫士2" 产品包名称
    parentkeyid?: string;//"2857"
    playcount: number;//1播放到第几集
    portraitImgUrl?: string;//"http://lexueimg.cedock.com/eduImg/upload/img4/20240311105100052.jpg"
    poster: string;// 图片 "http://lexueimg.cedock.com/eduImg/upload/img5/20240311105100052.jpg"
    status?: string//"ADD"
    type?: string;//"product"
    userId?: string;//"4E25E13948A6151A6AF4F072FAE65317"
    [k:string]: any
}

// Dto
export interface IHistoryMenuDto {
    code?: number
    data?: IHistoryMenuEntity[]
}
export interface IHistoryFilterDto {
    code?: number
    data?: IHistoryFilterEntity[]
    isHide?:boolean
}
export interface IHistoryContentDto {
    code?: number;
    page?: number;
    size?: number;
    data?: IHistoryContentEntity[]
    isNeedReload?:boolean//默认false 从详情页面返回时是否需要刷新数据
}