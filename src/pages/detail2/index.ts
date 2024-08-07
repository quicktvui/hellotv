import type {
  QTWaterfallSection, QTWaterfallItem
} from "@quicktvui/quicktvui3";
import { QTWaterfallSectionType, QTWaterfallItemType } from "@quicktvui/quicktvui3";
import type { IselectionPoster, IselectionBaseSection, IselectionSection,ItabListItem,IvideoParams,IvideoDes,Id2BaseSection, ImediaSelection } from '../../api/details2/types'
import { tabTypes, posterTypes } from '../../api/details2/types'
import { getPosterConfig } from '../../components/Hposter/configs'
import d2Api from '../../api/details2/index'
import { tUid } from "../../tools/common";
import {
  ESPlayerInterceptorType,
} from "@extscreen/es3-player"

export const D2SelectionsSectionTypes = {
  selection: 1, more: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_LIST
}

export const dVideoSectionPageSize = 10
const sWaterfallWidth = 1920
const sWaterfallHeight = 470

const dSectionSpace = 96
const dSectionTitleSize = 42
const dSectionTitleBottom = 30

export const getSelectionSeriesPoster = (sData:IselectionPoster) => {
  return {
    showVip: !!sData.corner, id: sData.id,
    vip: { enable: !!sData.corner, text: sData.corner||'' },
    title: sData.title||'',
    videoData: sData.videoData
  }
}

export const getSelectionPoster = (sData:IselectionPoster) => {
  const config = getPosterConfig({
    ...sData, titleLines: (sData.title||'').length>11?2:1
  })
  if(sData._type){
    config.type = sData._type
  }
  return {
    ...config,
    _router: sData._router,
    videoUrl: sData.videoUrl,
    videoData: sData.videoData
  }
}

export const ids = {
  selection: 'selection'
}
export const getSelectionSectionTabs = (data:ItabListItem) => {
  const type = data.type||tabTypes.text
  let right = 0
  if(tabTypes.btn){
    right = 20
  }
  if(tabTypes.smallText){
    right = 40
  }
  return {
    ...data, type,
    decoration: { right }
  }
}
interface ItabIdIndexValue {tabindex:number,tab2index:number,index:number,rootIndex:number}
const tabPosterIdIndex = new Map<string|number, ItabIdIndexValue>()
const rootIdIndex = new Map<string, number>()
/**
 * 全量索引注入
 */
const findTabIndex = (itemList:Array<TposterType>=[], rIndex, index2, rootId)=>{
  let rootIndex = rootIdIndex.get(rootId)||0
  itemList.forEach((item,index)=>{
    const tIndex = tabPosterIdIndex.get(item.videoData.id)
    if(tIndex){
      tIndex.rootIndex = rootIndex
    }else{
      tabPosterIdIndex.set(item.videoData.id, {
        tabindex:rIndex,tab2index:index2,index:index,
        rootIndex: rootIndex
      })
    }
    rootIndex++
  })
  rootIdIndex.set(rootId, rootIndex)
}
export const getSelectionSection = (data:IselectionSection):QTWaterfallSection => {
  const space = data._config?.space || dSectionSpace
  detail2Ui.selectionSpace = space

  data.tabList.forEach((item, index)=>{
    if(item.tabList){
      item.tabList.forEach((item2,index2)=>{
        if(item2.itemList){
          findTabIndex(item2.itemList, index, index2, item.id)
        }
      })
    } else if(item.itemList){
      findTabIndex(item.itemList, index, 0, item.id)
    }
  })
  rootIdIndex.clear()

  const section = getBlankSection(60, space-20)
  section._id = data.id
  section.type = D2SelectionsSectionTypes.selection
  section.itemList = (data.tabList as any)||[]
  section.decoration.top = 10
  section.decoration.bottom = 25

  detail2Ui.tabSid = section.listSID

  return section
}
export const getSelectionMoreSection = (data:IselectionBaseSection):QTWaterfallSection => {
  const space = data._config?.space || dSectionSpace
  const titleSize = dSectionTitleSize
  const titleBottom = dSectionTitleBottom
  return {
    _id: ids.selection+data.id, type: D2SelectionsSectionTypes.more,
    title: data.title,
    titleStyle: {
      width: 1000,
      height: data.title?titleSize+10:0,
      fontSize: data.title?titleSize:0,
      marginBottom: data.title?titleBottom:0
    },
    decoration: { top: 0, left: space, right: 0, bottom: dSectionTitleBottom },
    style: { width: sWaterfallWidth - space, height: 330, },
    itemList: data.itemList
  }
}

/**
 * 获取空白板块
 */
export const getBlankSection = (height = 0, space = 0) => {
  return {
    _id: tUid.cleateId('_id'), type: -1000, title: '',
    titleStyle: { width: 0, height: 0, fontSize: 0, marginBottom: 0 },
    decoration: { top: 0, left: space, right: 0, bottom: 0 },
    style: { width: sWaterfallWidth - space, height, minHeight: height },
    itemList:[],
    listSID: tUid.cleateId('listSID')
  }
}

export type TposterType = ReturnType<typeof getSelectionPoster>;
export type TselectionTabType = ReturnType<typeof getSelectionSectionTabs>;

/**
 * 获取视频播放拦截器配置
 */
export const getInterceptor = () => {
  return [{
    id: tUid.cleateId('d2-interceptors'),
    type: ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_ITEM,
    async intercept(...params:Array<any>):Promise<any>{
      const mediaItem = params[0]
      // d2Api.authenticationVideo(mediaItem) //鉴权接口
      let mediaSourceList = {
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
      let result = {
        result: {
          mediaSourceList: mediaSourceList
        }
      }
      return Promise.resolve(result)
    },
    release(){}
  }]
}
/**
 * 获取播放器需要的列表数据
 */
export const getMediaList = (playList: Id2BaseSection[]) => {
  return playList.map((vData,vDataIndex)=>{
    return {
      id: vData.videoData.id,
      title: vData.videoData.title,
      subTitle: vData.videoData.subTitle,
      videoUrl: vData.videoData.vUrl, vDataIndex,
      interceptors: getInterceptor()
    }
  })
}
/**
 * 根据索引计算分页
 */
export const getPageNo = (palyCount:number=0)=> {
  palyCount = palyCount+1
  const vpageSize = d2Api.getConfig().videoSectionPageSize||dVideoSectionPageSize
  return Math.ceil(palyCount / vpageSize)
}
/**
 * 根据选集索引计算分页索引
 */
export const getPageIndex = (palyCount:number=0,pageNo?:number)=> {
  if(!pageNo){
    pageNo = getPageNo(palyCount)
  }
  const vpageSize = d2Api.getConfig().videoSectionPageSize||dVideoSectionPageSize
  const index = (pageNo-1) * vpageSize
  return palyCount>=index ? palyCount-index : 0
}
/**
 * 根据分页索引计算选集索引
 */
export const getSelectionIndex = (pageNo:number, pageIndex:number)=> {
  if(pageNo<1){ pageNo = 1 }
  const vpageSize = d2Api.getConfig().videoSectionPageSize||dVideoSectionPageSize
  const index = (pageNo-1) * vpageSize
  return index + pageIndex
}

interface IpathLinked {
  index:number;
  next?:IpathLinked;
  selectionList?: Map<number, boolean>
}
class Detail2Ui {

  vdata?:IvideoDes// 详情页主视频信息
  playList:Id2BaseSection[] = []//下次要播放的视频列表
  private monitors = new Set<(list?:any[])=>void>()
  
  selectionSpace = 0//板块左右间距

  private prevSelectTabIndex=-1
  private prevSelectTab2Index=-1
  currentPlayPath:any[] = []
  selectTabIndex = 0
  selectTab2Index = 0
  selectTabListIndex = 0//当前播放视频在整个播放列表中的位置
  selectionPositoin = 0//选集的位置
  playIndex = 0//当前播放视频的索引
  tabPath = new Map<number, IpathLinked>()

  tabSid = ''
  tab2Sid = ''
  tabListSid = ''

  //选集数据
  selectionIndex = 0
  selectionPageNo = 1
  selectionList = new Map<number, ImediaSelection[]>()
  async getMediaSelectionList(pageNo:number, pageSize?:number){
    if(!pageSize){
      pageSize = d2Api.getConfig().videoSectionPageSize||dVideoSectionPageSize
    }
    if(this.selectionList.has(pageNo)){
      return this.selectionList.get(pageNo)||[]
    }
    const resList = await d2Api.getMediaSelectionList(this.vdata as IvideoDes,pageNo, pageSize)
    this.selectionList.set(pageNo, resList)
    return resList
  }

  /**
   * 设置初始详情页数据
   * @param vParams 
   */
  async setVideo(vParams: IvideoParams){
    const vData = await d2Api.getDetailVideoData(vParams)
    this.vdata = vData

    //预加载选集数据
    const initSelectionPageNo = getPageNo(this.vdata?.palyCount)
    this.selectionPageNo = initSelectionPageNo
    this.selectTab2Index = initSelectionPageNo
    const resList = await this.getMediaSelectionList(initSelectionPageNo)
    this.changePlayList(resList)
  }

  checkItemListOfVdata(iList:TposterType[]){
    for(let i = 0; i < iList.length; i++){
      const item = iList[i]
      if(item.videoData.id === this.vdata?.id){
        this.selectTabListIndex = i;
        return true
      }
    }
    return false;
  }
  /**
   * 初始化选集索引位置 
   */
  initIndex(){
    if(this.vdata){
      const idIndex = tabPosterIdIndex.get(this.vdata.id)
      if(idIndex){
        this.selectTabIndex = idIndex.tabindex
        this.selectTab2Index = idIndex.tab2index
        this.selectTabListIndex = idIndex.index
        this.playIndex = idIndex.index//根据id按当前列表计算初始焦点索引
      } else {
        this.selectTabIndex = this.selectionPositoin
        // this.selectTab2Index = idIndex.tab2index
        this.selectTabListIndex = getPageIndex(this.vdata.palyCount)
        this.playIndex = this.selectTabListIndex
        this.selectionIndex = this.vdata.palyCount||0//按播放记录设置初始焦点索引
      }
    }
    this.currentPlayPath = [this.selectTabIndex,this.selectTab2Index,this.selectTabListIndex]
    this.setTabPath()
  }
  setTabPath(){
    const tPath = this.tabPath.get(this.selectTabIndex)
    if(tPath&&tPath.next&&tPath.next.next){
      tPath.index = this.selectTabIndex
      tPath.next.index = this.selectTab2Index
      tPath.next.next.index = this.selectTabListIndex
    }else{
      this.tabPath.set(this.selectTabIndex, {
        index: this.selectTabIndex, selectionList:new Map<number, boolean>(),
        next: {
          index: this.selectTab2Index,
          next: {
            index: this.selectTabListIndex,
          }
        }
      })
    }
  }
  
  $on(fn:(list?:Id2BaseSection[])=>void){
    this.monitors.add(fn)
  }
  $off(fn:(list?:Id2BaseSection[])=>void){
    this.monitors.delete(fn)
  }
  $emit(){
    this.monitors.forEach(fn=>fn(this.playList))
  }

  /**
   * 切换视频
   */
  changeVideo(stlIndex){
    const playPath = [this.selectTabIndex,this.selectTab2Index,stlIndex]
    if(playPath.join()!=this.currentPlayPath.join()){

      this.selectTabListIndex = stlIndex
      this.playIndex = stlIndex
      this.currentPlayPath = playPath
      this.setTabPath()
      this.$emit()

      this.prevSelectTabIndex = this.selectTabIndex
      this.prevSelectTab2Index = this.selectTab2Index
    }
  }
  
  /**
   * 焦点是否在选集列表上
   */
  isSelection(){
    const currentTab = this.currentPlayPath[0]
    return currentTab == this.selectionPositoin
  }
  isChangedTab(){
    return this.prevSelectTabIndex!==this.selectTabIndex || this.prevSelectTab2Index!==this.selectTab2Index
  }
  
  addPlayList(newList:any[] = []){
    this.playList = this.playList.concat(newList)
  }
  changePlayList(newList?:any[], pageNo?:number){
    if(newList){
      this.prevSelectTab2Index = pageNo??this.prevSelectTab2Index
      this.playList = newList
    }
  }
  getCurrentPlay(){
    return this.playList[this.selectTabListIndex]
  }
  getTab2(tabItem:ItabListItem){
    const tabs2Section = detail2Ui.getShowTab(tabItem)
    
    let tabs2Item:any = null
    if(tabItem.tabList){
      tabs2Item = tabs2Section.itemList[detail2Ui.selectTab2Index]
    } else {
      tabs2Item = tabItem
    }
    const tab2ContentSection = detail2Ui.getShowTabList(tabs2Item as any)
    return { tabs2Section, tab2ContentSection }
  }

  getShowTab(data:ItabListItem){
    const section = getBlankSection(0, this.selectionSpace)
    section.type = D2SelectionsSectionTypes.selection
    if(data){
      section._id = data.id
      let tabItem:ItabListItem|null = null
      if(data.tabList){
        tabItem = data.tabList[0]
        section.itemList = data.tabList as any
      }
      if(tabItem){
        if(tabItem.type === tabTypes.btn){
          section.style.height = 66
          section.style.minHeight = 66
          section.decoration.bottom = 15
        }
        if(tabItem.type === tabTypes.smallText){
          section.style.height = 40
          section.style.minHeight = 40
          section.decoration.bottom = 25
          section.decoration.left = this.selectionSpace-15
        }
      }
    }
    
    this.tab2Sid = section.listSID
    return section
  }
  getShowTabList(data:ItabListItem){
    const section = getBlankSection(0, this.selectionSpace)
    section.type = D2SelectionsSectionTypes.selection//1007 vue-section

    if(data){
      section._id = data.id
      let listItem:TposterType|null = null
      if(data.itemList){
        listItem = data.itemList[0]
        section.itemList = data.itemList as any
      }
      if(listItem){
        if(listItem.type === posterTypes.bigBtn){
          section.style.height = 120
          section.style.minHeight = 120
        } else {
          section.style.height = listItem.style.height
          section.style.minHeight = listItem.style.height
        }
        section.decoration.bottom = dSectionTitleBottom
      }
    }
    if(data.isSelectionTab){
      this.selectionPositoin = this.selectTabIndex
      section.type = 1007
      section.decoration.left=0
      section.style.height = 280
      section.style.minHeight = 280
      this.tabListSid = ''
    } else {
      this.tabListSid = section.listSID
      this.changePlayList(section.itemList)
    }
    return section
  }
  clear(){
    rootIdIndex.clear()
    tabPosterIdIndex.clear()
    this.monitors.clear()
    this.playList = []
    this.selectionSpace = 0

    this.selectTabIndex = 0
    this.selectTab2Index = 0
    this.selectTabListIndex = 0

    this.tabSid = ''
    this.tab2Sid = ''
    this.tabListSid = ''
    this.prevSelectTabIndex =-1
    this.prevSelectTab2Index =-1
    this.currentPlayPath = []
    this.vdata = undefined
    this.tabPath = new Map<number, IpathLinked>()
    this.selectionPositoin = 0

    this.selectionPageNo = 1
    this.selectionIndex = 0
    this.selectionList = new Map<number, ImediaSelection[]>()

    this.playIndex = 0
  }
}
export const detail2Ui = new Detail2Ui()