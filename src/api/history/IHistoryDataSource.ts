export interface IHistoryDataSource {
    // getHotSearch(keyword?: string): Promise<Array<QTListViewItem>>
    saveHistoryList(params:any): Promise<any>
}
export const VIDEO_TYPE_SHORT_VIDEO = "0";//短视频
export const VIDEO_TYPE_lONG_VIDEO = "1";//长视频
export const VIDEO_TYPE_LIVE = "2";//直播
export const VIDEO_TYPE_LIVE_SINGLE = "3";//单场直播
