import { QTListViewItem,QTWaterfallSectionType } from '@quicktvui/quicktvui3';
import { rankingTypes } from '../../api/ranking/types';
import type { IrankingTabItem, IrankingContent, IrankingMoreContent,IrankingConfig } from '../../api/ranking/types';
import type {
  QTTabItem,QTWaterfallSection,QTWaterfallItem
} from "@quicktvui/quicktvui3";

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

const buildWaterfallItemList = ():QTWaterfallItem => {

  return  {
    _id: '',
    type: 10001,
    focus: {
      enable: true,
      scale: 1.1,
      border: false
    },
    decoration: {
      left: 0,
      right: 0
    },
    style: {
      width: 260,
      height: 320,
    },
  }
}

export const rankingContentTypes = {
  info: 1, sort: 2, more: 3
} as const;

export const transRankingContent = (data:IrankingContent, configs:IrankingConfig) => {
  const current = data.list[0]
  const sections = [
    {
      _id: '',
      type: rankingContentTypes.info,
      title: '',
      titleStyle: {
        width: 0.01,
        height: 0.01,
        marginLeft: 0.01,
        marginTop: 0.01,
        marginBottom: 0.01,
      },
      decoration: { top: 130, left: configs.pageSpace },
      style: {
        width: 1920, height: -1,
      },
      itemList:[],
      vcTitle: {
        text: current.title,
        style: current.title ? {
          height: 58,
          marginTop: 150
        } : undefined
      },
      vcSubTitle: {
        text: current.subTitle,
        style: current.subTitle ? {
          height: 40,
          marginTop: 0
        } : undefined
      },
      vcTitleImg: {
        url: current.titleImg,
        style: current.titleImg ? {
          height: 150,
          marginTop: 100
        } : undefined
      },
      des: {
        text: current.des,
        style: current.des ? {
          height: 90,
          marginTop: 15
        } : undefined
      },
      rankName: {
        text: data.rankName,
        style: data.rankName ? {
          height: 46,
          marginTop: 30
        } : undefined
      },
      tagStr: {
        text: `<font>${current.tagStr}</font> <font color="#FF9F0A" size="20">${current.score}</font>`,
        style: current.tagStr||current.score ? {
          height: 50,
          marginTop: 20
        } : undefined
      },
      isVedio: !current.previewImg,
      previewImg: current.previewImg,
      previewVedio: current.previewVedio,
      bgTags: current.bgTags?.map(item=>{
        return { ...item, type: 101 }
      })
    },
    {
      _id: '',
      type: rankingContentTypes.sort,
      title: '',
      titleStyle: {
        width: 0.01,
        height: 0.01,
        marginLeft: 0.01,
        marginTop: 0.01,
        marginBottom: 0.01,
      },
      style: {
        width: 1920, height: -1,
      },
      itemList:[]
    }
  ]
  return { sections }
}
export const transRankingMoreContent = (data:IrankingMoreContent, configs:IrankingConfig) => {
  const sections = []
  return { sections }
}

export const transRankingSections = (data:IrankingContent|IrankingMoreContent, configs:IrankingConfig) => {
  if(data.type === rankingTypes.sort){
    return transRankingContent(data as IrankingContent, configs)
  } else {
    return transRankingMoreContent(data as IrankingMoreContent, configs)
  }
}