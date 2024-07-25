import type {
  QTWaterfallSection, QTWaterfallItem
} from "@quicktvui/quicktvui3";
import { RequestManager } from "../request/RequestManager";
import {IDetail2Config,IAnyobj, Id2TopData, IvideoDes,posterTypes,tabTypes} from './types'
// @ts-ignore
import { getSelectionSection,getSelectionMoreSection,getSelectionPoster,getSelectionSectionTabs,TposterType } from '../../pages/detail2/index.ts'
import {
  ESIPlayerInterceptor, ESMediaSourceList,
  ESPlayerInterceptorType,
  ESPlayerInterceptResult
} from "@extscreen/es3-player"
import { ESMediaItem } from "@extscreen/es3-player-manager"
import { getDefaultVideoData, videos } from './mock'

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
  pageData: IAnyobj | undefined;

  init(...params: any[]): Promise<any> {
    this.requestManager = params[0]
    return Promise.resolve()
  }
  /**
   * 加载初始化数据
   * @param routerParams 当前页面的路由参数对象
   */
  async initPageData(routerParams: IAnyobj): Promise<any> {
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
   * 获取视频介绍信息数据
   */
  async getVideoDes(data:TposterType):Promise<IvideoDes>{
    // console.log(data.videoData.id)
    return data.videoData
  }

  async getSelectionsData():Promise<QTWaterfallSection[]>{

    return [
      getSelectionSection({
        id: 'd2SelectionSection1',
        tabList: [
          getSelectionSectionTabs({
            id: 'd2SelectionSection1-1', name: '选集',
            tabList:[
              getSelectionSectionTabs({
                id: 'd2SelectionSection1-1-1', name: '1~20', type: tabTypes.btn,
                itemList: new Array(10).fill(1).map((_,index)=>{
                  return getSelectionPoster({
                    id: 'd2SelectionSection1-1-1'+index, _type: posterTypes.bigBtn,
                    title: `第${index}集`, poster: '', videoUrl: videos[index%4],
                    subTitle: 'subTitle',
                    videoData: getDefaultVideoData('福尔摩斯小姐：伦敦厄运'+index)
                  })
                })
              }),
              getSelectionSectionTabs({
                id: 'd2SelectionSection1-1-2', name: '20~40', type: tabTypes.btn,
                itemList: new Array(10).fill(1).map((_,index)=>{
                  const toIndex = index+20
                  return getSelectionPoster({
                    id: 'd2SelectionSection1-1-2'+toIndex, _type: posterTypes.bigBtn,
                    title: `第${toIndex}集`, poster: '', videoUrl: videos[index%4],
                    videoData: getDefaultVideoData('福尔摩斯小姐：伦敦厄运'+toIndex)
                  })
                })
              })
            ]
          }),
          getSelectionSectionTabs({
            id: 'd2SelectionSection1-2', name: '系列',
            itemList: new Array(10).fill(1).map((_,index)=>{
              return getSelectionPoster({
                id: 'd2SelectionSection1-2'+index, _type: posterTypes.bigBtn,
                title: `复仇者联盟系列: ${index}`, videoUrl: videos[(index+1)%4],
                poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170400041.png',
                videoData: getDefaultVideoData(`复仇者联盟系列: ${index}`)
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
                    id: 'd2SelectionSection1-3-1'+index,
                    title: '预告花絮'+index, videoUrl: videos[(index+2)%4],
                    poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170400041.png',
                    videoData: getDefaultVideoData('预告花絮'+index)
                  })
                })
              }),
              getSelectionSectionTabs({
                id: 'd2SelectionSection1-3-2', name: '精彩看点', type: tabTypes.smallText,
                itemList: new Array(10).fill(1).map((_,index)=>{
                  return getSelectionPoster({
                    id: 'd2SelectionSection1-3-2'+index,
                    title: '精彩看点 '+index, videoUrl: videos[(index+3)%4],
                    poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170400041.png',
                    videoData: getDefaultVideoData('精彩看点'+index)
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
            title: (index===2?'福尔摩斯小姐：伦敦厄运 Enola Holmes':'权力的游戏')+index,
            subTitle: '2024-02-08上映', videoUrl: videos[index%4],
            poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170400041.png',
            videoData: getDefaultVideoData(index===2?'福尔摩斯小姐：伦敦厄运 Enola Holmes':'权力的游戏')
          })
        })
      }),
      getSelectionMoreSection({
        id: 'd2SelectionSection3',
        title: '更多剧情',
        itemList: new Array(10).fill(1).map((_,index)=>{
          return getSelectionPoster({
            id: 'd2SelectionSection3'+index,
            title: '生化危机: 死亡岛'+index,
            subTitle: '2024-03-08上映', videoUrl: videos[index%4],
            poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170600002.png',
            videoData: getDefaultVideoData('生化危机: 死亡岛'+index)
          })
        })
      })
    ]
  }

  getMediaDataOfInterceptor(vData:TposterType){
    return {
      id: vData.id,
      title: vData.title.text||'',
      subTitle: vData.subTitle.text||'',
      videoUrl: vData.videoUrl,
      interceptors:[{
        id:"d2PlayerMediaInterceptor",
        type:ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_ITEM,
        async intercept(...params:Array<any>):Promise<ESPlayerInterceptResult>{
          const mediaItem = params[0] as ESMediaItem
          let mediaSourceList: ESMediaSourceList = {
            index: 0,
            list: [{ uri: mediaItem.videoUrl, definition: 1 }]
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