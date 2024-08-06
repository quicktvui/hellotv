/**
 * 历史上报
 */
// import { ESBasePlayerManagerEventListener } from '@extscreen/es-player-manager';

// export const SERVER_ANALYZE_PARAMS_VIDEO_TYPE_SHORT_VIDEO = "0";//长视频
// export const SERVER_ANALYZE_PARAMS_VIDEO_TYPE_lONG_VIDEO = "1";//短视频
// export const SERVER_ANALYZE_PARAMS_VIDEO_TYPE_LIVE = "2";//直播
// export const SERVER_ANALYZE_PARAMS_VIDEO_TYPE_LIVE_SINGLE = "3";//单场直播
// const TAG = 'HistoryAnalyzeManager';

// class PlayerEventHistoryAnalyzeManager extends ESBasePlayerManagerEventListener {

//   _enabled = true;
//   _playerProgress = -1;
//   _playerDuration = 0;

//   //是否上报了video_detail事件
//   _analyzePlayHistoryEvent = false;

//   series:any = null;

//   getId() {
//     return 'PlayerEventHistoryAnalyzeManager';
//   }

//   onVideoPlayerPlaySeries(series) {
//     this.series = series;
//   }

//   onVideoPlayerPlayUrls(urlList) {
//     this._playerProgress = 0;
//     this._playerDuration = 0;
//     this._analyzePlayHistoryEvent = true;
//   }

//   onVideoPlayerPlayUrl(url) {
//     this._analyzePlayHistoryEvent = false;
//   }

//   onVideoPlayerProgressChanged(progress) {
//     this._playerProgress = progress;
//   }

//   onVideoPlayerDurationChanged(duration) {
//     this._playerDuration = duration;
//   }

//   onVideoPlayerStopped() {
//     let series = this.series;
//     if (!this.checkArgument(series)) {
//       return;
//     }
//     let analyze = series.historyAnalyze;
//     let analyzeParams = analyze.params;
//     this.analyzePlayHistoryEvent(series, analyzeParams);
//     this.series = null;
//   }

//   onVideoPlayerCompleted() {
//     let series = this.series;
//     if (!this.checkArgument(series)) {
//       return;
//     }
//     let analyze = series.historyAnalyze;
//     let analyzeParams = analyze.params;
//     this.analyzePlayHistoryEvent(series, analyzeParams);
//     this.series = null;
//   }

//   analyzePlayHistoryEvent(series, analyzeParams) {
//     if (this._analyzePlayHistoryEvent) {
//         console.log(TAG, '-----历史上报-----已经上报过历史事件---->>>>>');
//         return;
//       }
//       if (this._playerProgress < 0) {
//         console.log(TAG, '-----历史上报-----当前播放进度小于0---->>>>>' + this._playerProgress)
//         return;
//       }
//     //短片
//     if (analyzeParams.assetType === SERVER_ANALYZE_PARAMS_VIDEO_TYPE_SHORT_VIDEO) {
//       let historyData = {
//         //
//         assetId: analyzeParams.assetId,
//         assetName: analyzeParams.assetName,
//         //
//         channelId: analyzeParams.channelId,
//         channelName: analyzeParams.channelName,
//         //
//         columnId: analyzeParams.columnId,
//         columnName: analyzeParams.columnName,
//         //
//         cover: analyzeParams.assetCover,
//         //播放进度
//         currentPlayTime: this._playerProgress,
//         totalPlayTime: this._playerDuration
//       };
//     //   saveShortHistory(historyData);
//     }
//     //长片
//     else {
//       let historyData = {
//         platformId: analyzeParams.platformId,
//         metaId: analyzeParams.metaId,
//         assetLongId: analyzeParams.assetLongId,
//         episodeId: analyzeParams.episodeId,
//         currentPlayTime: this._playerProgress,
//         totalPlayTime: this._playerDuration,
//         episode: analyzeParams.episode,
//         assetLongTitle: analyzeParams.assetLongTitle,
//         episodeTitle: analyzeParams.episodeTitle,
//         assetLongCoverH: analyzeParams.assetLongCoverH,
//         assetLongCoverV: analyzeParams.assetLongCoverV
//       };
//     //   saveSeriesHistory(historyData);
//     }

//     this._analyzePlayHistoryEvent = true;
//   }

//   checkArgument(series) {
//     if (series === null || series === undefined) {
//       return false;
//     }
//     //
//     let analyze = series.historyAnalyze;
//     if (analyze === null || analyze === undefined || !analyze.support) {
//       return false;
//     }
//     //参数
//     let analyzeParams = analyze.params;
//     if (analyzeParams === undefined) {
//       return false;
//     }
//     return true;
//   }

// }

// export default new PlayerEventHistoryAnalyzeManager();
