import { IHistoryContentEntity, IHistoryFilterEntity } from "./modelEntity"

export const getTestFilterList = (): IHistoryFilterEntity[] => {
    return [
        { id: 0, name: '全部' },
        { id: 1, name: '影视综合' },
        { id: 2, name: '小视频' },
        { id: 3, name: '绘本' },
        { id: 4, name: '绘本2' },
        { id: 5, name: '绘本3' },
        { id: 6, name: '绘本4' },
        { id: 7, name: '绘本5' },
        { id: 8, name: '绘本6' },
        { id: 9, name: '绘本7' },
        { id: 10, name: '绘本8' },
    ]
}

export const getTestContentList = (size = 20, pageNum:number=1): IHistoryContentEntity[] => {
    return new Array(size).fill(1).map((item, index) => {
        return {
            assetId: '',
            assetLongCoverH: "http://qcloudimg.a311.ottcn.com/channelzero_image/2022/08/09/dd6ce497-ee81-46f2-8399-24b543e09fd4.jpg?imageMogr2/interlace/0|imageMogr2/gravity/center/crop/320x180",
            assetLongId: "1553955134392692738",
            assetLongTitle: (index<1?"蜘蛛侠蜘蛛侠蜘蛛侠蜘蛛侠蜘蛛侠蜘蛛侠蜘蛛侠":'蜘蛛侠')+pageNum,
            assetType: "1",
            currentPlayTime: '',
            description1: "共1集",
            id: index + '' + pageNum,
            metaId: "1425432071282630657",
            payType: "2",
            platformId: "1408002578460987393",
            playCount: index==2 ? '' : "1",
            playTime: "2024-03-22 17:35:20",
            userId: "9BD63E4D4960B114248F4B0038D60112:bc9d4e6a000f",
            // h_modeName: index==0&&pageNum==1?'分类-'+index: ''
        }
    })
}