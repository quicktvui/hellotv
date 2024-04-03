import { IHistoryContentEntity, IHistoryFilterEntity } from "./modelEntity"

export const getTestFilterList = (): IHistoryFilterEntity[] => {
    return [
        { id: 0, name: '全部' },
        { id: 0, name: '影视综合' },
        { id: 0, name: '小视频' },
        { id: 0, name: '绘本' },
    ]
}

export const getTestContentList = (size = 20, pageNum:number=1): IHistoryContentEntity[] => {
    return new Array(size).fill(1).map((item, index) => {
        return {
            assetId: '',
            assetLongCoverH: "http://qcloudimg.a311.ottcn.com/channelzero_image/2022/08/09/dd6ce497-ee81-46f2-8399-24b543e09fd4.jpg?imageMogr2/interlace/0|imageMogr2/gravity/center/crop/320x180",
            assetLongId: "1553955134392692738",
            assetLongTitle: "蜘蛛侠"+pageNum,
            assetType: "1",
            currentPlayTime: '',
            description1: "共1集",
            id: index + '',
            metaId: "1425432071282630657",
            payType: "2",
            platformId: "1408002578460987393",
            playCount: "1",
            playTime: "2024-03-22 17:35:20",
            userId: "9BD63E4D4960B114248F4B0038D60112:bc9d4e6a000f",
            h_modeName: index==0&&pageNum==1?'分类-'+index: ''
        }
    })
}