import type {
  QTWaterfallSection, QTWaterfallItem
} from "@quicktvui/quicktvui3";
import { RequestManager } from "../request/RequestManager";
import {IDetail2Config, Id2TopData, IvideoDes,posterTypes,tabTypes,IvideoParams,ImediaSelection,Id2BaseSection} from './types'
// @ts-ignore
import { getSelectionSection,getSelectionMoreSection,getSelectionPoster,getSelectionSectionTabs,TposterType } from '../../pages/detail2/index.ts'
import {
  ESIPlayerInterceptor, ESMediaSourceList,
  ESPlayerInterceptorType,
  ESPlayerInterceptResult
} from "@extscreen/es3-player"
import { ESMediaItem } from "@extscreen/es3-player-manager"
import { getMockVideoData } from './mock'
import { tUid } from '../../tools/common'

import homeIcon from '../../assets/ic_header_home.png'
import homeIconf from '../../assets/ic_header_home_focus.png'
import logo from '../../assets/ic_media_vip_button_focused.png'
import searchIcon from '../../assets/ic_top_search.png'
import searchIconf from '../../assets/ic_top_search_focus.png'

const delayFn = ()=>{
  return new Promise(resolve=>{
    setTimeout(() => {
      resolve(true)
    }, 1000);
  })
}
export class Detail2Base {
  requestManager: RequestManager | undefined;
  pageData: {[k:string]:any} | undefined;

  init(...params: any[]): Promise<any> {
    this.requestManager = params[0]
    return Promise.resolve()
  }
  /**
   * 加载初始化数据
   * @param routerParams 当前页面的路由参数对象
   */
  async initPageData(routerParams:object): Promise<any> {
    await delayFn()
    return {}
  }
  /**
   * 获取页面配置信息，子类重写该方法时必须先调用父类的getConfig获取默认配置
   */
  getConfig(): IDetail2Config {
    return {
      isShowTop: true, topMode: 'rightLogo',
      desTopDistance: 40
    }
  }
  /**
   * 获取顶部栏数据
   */
  async getTopList(): Promise<Id2TopData> {
    return {
      logo: { title: '云视听', titleIcon:logo },
      btns: [
        { id: 1, text: '搜索：亨利·卡维尔', lIcon:searchIcon, lIconf: searchIconf, router:{route:{name: 'search'}} },
        { id: 2, text: '首页', lIcon:homeIcon, lIconf:homeIconf, router:{route:{name: 'home'},isReplace:true} },
        { id: 3, text: '全部电影', lIcon:homeIcon, lIconf:homeIconf, router:{route:{name: 'screen_main_view'}} },
      ]
    }
  }
  /**
   * 获取视频详情数据
   */
  async getDetailVideoData(data: IvideoParams):Promise<IvideoDes>{
    // console.log(data.videoData.id) todo:通过参数id获取详情视频数据
    const res = getMockVideoData(0)
    return res
  }

  /**
   * 获取视频选集列表信息，支持分页
   * @param vdata 视频数据
   * @param pageNo 选集分页的第几页
   * @param pageSize 选集分页的每页的条数
   */
  async getMediaSelectionList(vdata:IvideoDes, pageNo=1, pageSize=10):Promise<ImediaSelection[]>{
    // console.log(vdata.id)
    let isLast = Math.floor(vdata.selectionTotalSize / pageSize) <= pageNo;
    let size = isLast ? vdata.selectionTotalSize - (pageNo * pageSize) : pageSize;

    return new Array(size).fill(1).map((_, index)=>{
      return {
        showVip: pageNo===2,
        vip: { enable: pageNo===2, text: 'VIP' },
        title: '第' + (pageNo * pageSize + index) + '集',
        videoData: getMockVideoData(index)
      }
    });
  }
  
  /**
   * 获取选集/系列/更多信息等标签页，配置数据
   */
  async getSelectionsData():Promise<QTWaterfallSection[]>{
    return [
      getSelectionSection({
        id: 'd2SelectionSection1',
        tabList: [
          getSelectionSectionTabs({
            id: 'd2SelectionSection1-1', name: '选集', isSelectionTab:true
          }),
          getSelectionSectionTabs({
            id: 'd2SelectionSection1-2', name: '系列',
            itemList: new Array(10).fill(1).map((_,index)=>{
              return getSelectionPoster({
                id: 'd2SelectionSection1-2'+index, _type: posterTypes.bigBtn,
                title: `复仇者联盟系列: ${index}`,
                poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170400041.png',
                videoData: getMockVideoData(index)
              })
            })
          }),
          getSelectionSectionTabs({
            id: 'd2SelectionSection1-3', name: '花絮',
            tabList:[
              getSelectionSectionTabs({
                id: 'd2SelectionSection1-3-1', name: '预告花絮', type: tabTypes.smallText,
                itemList: new Array(10).fill(1).map((_,index)=>{
                  return getSelectionPoster({
                    id: 'd2SelectionSection1-3-1'+index, title: '预告花絮'+index,
                    poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170400041.png',
                    videoData: getMockVideoData(index)
                  })
                })
              }),
              getSelectionSectionTabs({
                id: 'd2SelectionSection1-3-2', name: '精彩看点', type: tabTypes.smallText,
                itemList: new Array(10).fill(1).map((_,index)=>{
                  return getSelectionPoster({
                    id: 'd2SelectionSection1-3-2'+index, title: '精彩看点 '+index,
                    poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170400041.png',
                    videoData: getMockVideoData(index)
                  })
                })
              }),
            ]
          })
        ]
      }),
      getSelectionMoreSection({
        id: 'd2SelectionSection2',
        title: '相关剧情',
        itemList: new Array(10).fill(1).map((_,index)=>{
          return getSelectionPoster({
            id: 'd2SelectionSection2'+index,
            title: '权力的游戏'+index, subTitle: '2024-02-08上映',
            poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170400041.png',
            videoData: getMockVideoData(index)
          })
        })
      }),
      getSelectionMoreSection({
        id: 'd2SelectionSection3',
        title: '更多剧情',
        itemList: new Array(10).fill(1).map((_,index)=>{
          return getSelectionPoster({
            id: 'd2SelectionSection3'+index,
            title: '生化危机: 死亡岛'+index, subTitle: '2024-03-08上映',
            poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170600002.png',
            videoData: getMockVideoData(index)
          })
        })
      })
    ]
  }

  /**
   * 视频播放地址鉴权转换函数
   */
  getMediaDataOfInterceptor(vData:Id2BaseSection){
    return {
      id: vData.videoData.id,
      title: vData.videoData.title,
      subTitle: vData.videoData.subTitle,
      videoUrl: vData.videoData.vUrl,
      interceptors:[{
        id: tUid.cleateId('d2-interceptors'),
        type:ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_ITEM,
        async intercept(...params:Array<any>):Promise<ESPlayerInterceptResult>{
          const mediaItem = params[0] as ESMediaItem
          let mediaSourceList: ESMediaSourceList = {
            index: 0,
            list: [
              // { uri: mediaItem.videoUrl, definition: 0 },//标清
              { uri: mediaItem.videoUrl, definition: 1 },//标清
              { uri: mediaItem.videoUrl, definition: 2 },//高清
              // { uri: mediaItem.videoUrl, definition: 3 },//超清
              // { uri: mediaItem.videoUrl, definition: 4 },//原画
              // { uri: mediaItem.videoUrl, definition: 5 },//蓝光
              // { uri: mediaItem.videoUrl, definition: 6 },//4k
              // { uri: mediaItem.videoUrl, definition: 7 },//2k
            ]
          }
          let result: ESPlayerInterceptResult = {
            result: {
              mediaSourceList: mediaSourceList
            }
          }
          return Promise.resolve(result)
        },
        release(){}
      }],
    }
  }
}

// getSelectionSectionTabs({
//   id: 'd2SelectionSection1-1-1', name: '1~20', type: tabTypes.btn,
//   isSelect:true,
//   itemList: new Array(10).fill(1).map((_,index)=>{
//     return getSelectionPoster({
//       id: 'd2SelectionSection1-1-1'+index, _type: posterTypes.bigBtn,
//       title: `第${index}集`, poster: '',
//       subTitle: 'subTitle', videoData: getDefaultVideoData(tUid.cleateId())
//     })
//   })
// })