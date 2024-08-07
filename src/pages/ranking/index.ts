import { rankingTypes, IposterConfig } from '../../api/ranking/types';
import type { IrankingTabItem, IrankingContent, IrankingMoreContent,IrankingConfig, IrankingContentItem } from '../../api/ranking/types';
import type {
  QTTabItem, QTITab, QTWaterfallSection,QTWaterfallItem
} from "@quicktvui/quicktvui3";
import { VirtualView, QTWaterfallSectionType, QTWaterfallItemType } from "@quicktvui/quicktvui3";
import rankApi from '../../api/ranking/index';
// import numImg1 from '../../assets/ranking/1.png'
// import numImg2 from '../../assets/ranking/2.png'
// import numImg3 from '../../assets/ranking/3.png'
// import numImg4 from '../../assets/ranking/4.png'
// import numImg5 from '../../assets/ranking/5.png'
// import numImg6 from '../../assets/ranking/6.png'
// import numImg7 from '../../assets/ranking/7.png'
// import numImg8 from '../../assets/ranking/8.png'
// import numImg9 from '../../assets/ranking/9.png'
// import numImg10 from '../../assets/ranking/10.png'

export const pageWidth = 1920
export const pageHeight = 1080

/**
 * tab栏数据转换函数
 */
export const transRankingTabList = (arr:IrankingTabItem[], configs:IrankingConfig):QTTabItem[] => {
  return arr.map((item,index) => {
    return { 
      _id: (item.id||'tab')+index,text: item.text, type: 1, titleSize: 30,
      decoration: {
        left: index===0 ? configs.pageSpace - 25 : 0,
        right: index===arr.length-1 ? configs.pageSpace : 0
      } 
    }
  })
}

const ids = {
  currentSection: 'rankingCurrentSection-',
  rankingSortSection: 'rankingSortSection-',
  rankingMoreSection: 'rankingMoreSection-',
  listSID: 'listSID'
}
export const rankingContentTypes = {
  info: 1, sort: 2, more: 3
} as const;

const dPosterWidth = 396
const dPosterHeight = 222
const dPosterRightSpace = 48
const dPosterTopSpace = 0
const getRankingPoster = (pData:IrankingContentItem, config:IposterConfig, index?:number) => {
  const imgW = config.posterImgWidth||config.posterWidth||dPosterWidth
  const imgH = config.posterImgHeight||config.posterHeight||dPosterHeight
  return {
    _router: pData._router,
    _id: pData.id, type: config.posterType||QTWaterfallItemType.QT_WATERFALL_ITEM_TYPE_POSTER,
    focus: { enable: true, scale: 1.1, border: true },
    decoration: {
      left: 0, top: config.posterTopSpace||dPosterTopSpace,
      right: config.posterRightSpace||dPosterRightSpace
    },
    style: {
      width: config.posterWidth||dPosterWidth,
      height: config.posterHeight||dPosterHeight,
    },
    image: {
      src: pData.poster, enable: true,
      style: {
        width: imgW,
        height: imgH,
      }
    },
    title: {
      text: '',
      enable: false,
      style: {}
    },
    subTitle: {
      text: '',
      enable: false,
      style: {}
    },
    floatTitle: {
      text: '',
      enable: false,
      style: {},
    },
    shimmer: {
      enable: false,
    },
    ripple: {
      enable: false,
      style: {}
    },
    corner: {
      text: '',
      enable: false,
      style: {},
      background: {}
    },
    titleStyle: { },
    titleFocusStyle: { },
    numImg: {
      url: (index||index===0)?require(`../../assets/ranking/${index+1}.png`).default:undefined,//`../../../assets/ranking/1.png`,
      style: {
        width: 224,
        height: 308,
        marginTop: 40,
        marginLeft: -50
      }
    },
    coverStyle: {
      width: imgW + 12,
      height: imgH + 12
    }
  }
}
const getCurrentSection = (current:IrankingContentItem, data?:IrankingContent, configs?:IrankingConfig, oldCurrent?:{[k:string]:any}) => {
  let tagStrText = ''
  if(current.tagStr){
    tagStrText += `<font>${current.tagStr}</font> `
  }
  if(current.score){
    tagStrText += `<font color="#FF9F0A" size="20">${current.score}</font>`
  }
  const rankName = current.rankName||data?.rankName||oldCurrent?.rankName.text
  return {
    _id: oldCurrent?._id || ids.currentSection+data?.id,//+current.id
    type: rankingContentTypes.info,
    title: '',
    titleStyle: {
      width: 0.01,
      height: 0.01,
      marginLeft: 0.01,
      marginTop: 0.01,
      marginBottom: 0.01,
    },
    decoration: oldCurrent?.decoration || { top: 130, left: configs?.pageSpace||0 },
    style: oldCurrent?.style || {
      width: pageWidth - (configs?.pageSpace||0), height: 650,
    },
    itemList:[],
    vcTitle: {
      text: current.title,
      style: {
        height: current.title?58:0,
        marginTop: current.title?150:0
      }
    },
    vcSubTitle: {
      text: current.subTitle,
      style: {
        height: current.subTitle?40:0,
        marginTop: 0
      }
    },
    vcTitleImg: {
      url: current.titleImg,
      style:  {
        height: current.titleImg?150:0,
        marginTop: current.titleImg?100:0
      }
    },
    des: {
      text: current.des,
      style: {
        height: current.des?90:0,
        marginTop: current.des?15:0
      }
    },
    rankName: {
      text: rankName,
      style: {
        height: rankName?46:0,
        marginTop: rankName?30:0
      }
    },
    tagStr: {
      text: tagStrText,
      style: {
        height: tagStrText?50:0,
        marginTop: tagStrText?20:0
      }
    },
    isVedio: !current.previewImg,
    previewImg: current.previewImg,
    previewVedio: current.previewVedio,
    bgTags: (current.bgTags||[]).map(item=>{
      return { ...item, type: 101 }
    })
  }
}

export const transRankingContent = (data:IrankingMoreContent, configs:IrankingConfig) => {
  const sections:QTWaterfallSection[] = []
  const content = data.moreList[0]
  if(data){
    const itemList = content.list.map((item,index)=>{
      return getRankingPoster(item, {
        posterWidth: 320, posterHeight: 348,
        posterImgWidth: 246, posterImgHeight: 348,
        posterRightSpace: 70, posterType: 1,
        ...(content.config||{})
      }, index)
    })
    sections.push(getCurrentSection(content.list[0], content, configs))
    sections.push({
      _id: ids.rankingSortSection+data.id, type: rankingContentTypes.sort,
      title: '',
      titleStyle: {},
      decoration: { top: -150, left: configs.pageSpace },
      style: { width: pageWidth - configs.pageSpace, height: 350, },
      itemList
    })
  }
  
  return { sections }
}

const dMcTitleHeight = 52
const dMcTitleBottom = 20
const dMcTitleTop = 40
export const transRankingMoreContent = (data:IrankingMoreContent, configs:IrankingConfig) => {

  const itemList = data.moreList.map((item,index) => {
    const isFirst = index === 0
    const isLast = index === data.moreList.length-1
    const titleStyle = {
      width: 1000,
      height: isFirst?0:dMcTitleHeight,
      marginTop: 0,
      marginBottom: isFirst?0:dMcTitleBottom,
      fontSize: isFirst?0:42
    }
    const titleReactH = titleStyle.height+titleStyle.marginTop+titleStyle.marginBottom
    return {
      _id: item.id, listSID: ids.listSID+item.id,
      type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_LIST,
      enableFirstFocusAtStart: true,
      // firstFocusChild:{up:0},
      title: isFirst?'':item.rankName,
      titleStyle: titleStyle,
      itemList: item.list.map((mlItem,mlIndex)=>{
        return getRankingPoster({...mlItem, rankName: item.rankName}, item.config||{})
      }),
      style: {
        width: pageWidth - configs.pageSpace,
        height: dPosterHeight+titleReactH,
      },
      decoration: {
        left: configs.pageSpace, right: 0, top: isFirst?15:0, bottom: isLast?160:dMcTitleTop
      }
    }
  })
  const sections:QTWaterfallSection[] = [
    getCurrentSection(data.moreList[0].list[0], data.moreList[0], configs),
    {
      _id: ids.rankingMoreSection+data.id, type: rankingContentTypes.more,
      title: '',
      titleStyle: {},
      decoration: { top: data.topSpace??-102 },//102 680
      style: { width: pageWidth , height: 400, },//400 1080
      // waterFallStyle: { width: pageWidth , height: 900, marginTop: -500 },
      itemList
    }
  ]
  return { sections }
}

export const transRankingSections = (data:IrankingMoreContent, configs:IrankingConfig) => {
  if(data.type === rankingTypes.sort){
    return transRankingContent(data, configs)
  } else {
    return transRankingMoreContent(data, configs)
  }
}

interface Iindex {
  pageIndex?:number;
  sectionIndex?:number;
  itemIndex?:number
}
class RankingUi {
  private pageIndex:number = -1
  private tabRef?:QTITab;
  private tabSid:string='';
  private bgPlayerRef:any
  private showPageIndex:number = -1
  private showSectionIndex:number = 0
  private showItemIndex:number = 0
  private catchRawValue:Map<number, IrankingMoreContent> = new Map()
  private prevIndexStr:string = ''

  playBg(data, isSetImg=true){
    if(data){
      if(isSetImg){
        this.bgPlayerRef.initPlayBg(data.previewImg)
      }
      this.bgPlayerRef.initPlayBg(data.previewImg)
      this.bgPlayerRef.showCoverImmediately()
      this.bgPlayerRef.stopIfNeed()
      if(data.previewVedio){
        this.bgPlayerRef.play({
          cover: data.previewImg,
          id: data._id,
          isRequestUrl: false,
          url: data.previewVedio
        })
      }
    }
  }
  updateCurrent(rwaData:IrankingContentItem, section){
    if(this.showPageIndex>-1){
      const oldSectin = this.tabRef?.getPageSection(this.showPageIndex, 0);
      const newSection = getCurrentSection(rwaData, section, undefined, oldSectin)
      if(oldSectin?._id && this.bgPlayerRef){
        VirtualView.updateChild(this.tabSid,oldSectin?._id, newSection)
        this.playBg(newSection)
      }
    }
  }

  getSid(indexs:Iindex){
    if(indexs.sectionIndex != undefined){
      if(indexs.itemIndex != undefined){
        return this.catchRawValue.get(this.showPageIndex)?.moreList[indexs.sectionIndex].list[indexs.itemIndex].id
      }
      return ids.listSID + this.catchRawValue.get(this.showPageIndex)?.moreList[indexs.sectionIndex].id
    }
  }

  changeData(indexs:Iindex, bgPlayerRef?:any){
    
    this.showPageIndex = indexs.pageIndex??this.showPageIndex
    this.showSectionIndex = indexs.sectionIndex??this.showSectionIndex
    this.showItemIndex = indexs.itemIndex??this.showItemIndex
    const cIndexStr = ''+this.showPageIndex+this.showSectionIndex+this.showItemIndex
    if(this.prevIndexStr===cIndexStr){
      return
    }else{
      this.prevIndexStr = cIndexStr
    }
    try {
      const sectionMore = this.catchRawValue.get(this.showPageIndex)
      const section = sectionMore?.moreList[this.showSectionIndex]
      const sData = section?.list[this.showItemIndex]
      if(sData){
        if(this.bgPlayerRef){
          this.updateCurrent(sData, section) //更新背景
        } else if(bgPlayerRef) {
          this.bgPlayerRef = bgPlayerRef//初始化背景
          bgPlayerRef.doChangeParent('', 2,
            1920, 1080, 1140, 640,
            [{ 
              cover: sData.previewImg,
              id: sData.id,
              isRequestUrl: false,
              url: sData.previewVedio||''//"http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
            }],
            0, 730, 90,1
          )
        }
      }
    } catch (error) {
      console.warn(error, '-lsj-err')
    }
  }

  setData(tabRef:QTITab, pageIndex:number, tApiData:IrankingTabItem){
    rankApi.getContentData(pageIndex,tApiData).then(res=>{
      const {sections} = transRankingSections(res, rankApi.getConfig())
      tabRef.setPageData(pageIndex, {
        useDiff: false, isEndPage: true, disableScrollOnFirstScreen: false,
        data: sections
      })
      this.catchRawValue.set(pageIndex, res)
    })
    if(!this.tabRef && tabRef){
      this.tabRef = tabRef
      this.tabSid = (tabRef as any).$attrs?.sid
    }
    this.pageIndex = pageIndex
  }

  stop(){
    // this.bgPlayerRef.reset()
    this.bgPlayerRef.pause()
    this.bgPlayerRef.stop()
    const itemData = this.tabRef?.getPageSection(this.showPageIndex, 0);
    if(itemData){
      this.bgPlayerRef.initPlayBg(itemData.previewImg)
    }
  }
  reStart(){
    // this.bgPlayerRef?.resume()
    // this.bgPlayerRef?.start()
    const itemData = this.tabRef?.getPageSection(this.showPageIndex, 0);
    this.playBg(itemData, false)
  }

  clear(){
    this.pageIndex = -1
    this.tabRef = undefined
    this.bgPlayerRef = undefined
    this.showPageIndex = -1
    this.showSectionIndex = 0
    this.showItemIndex = 0
    this.catchRawValue = new Map()
    this.prevIndexStr = ''
  }
}

export const rankingUi = new RankingUi()