import {
  QTPoster, QTWaterfallItem,
	QTWaterfallSection,
	QTWaterfallSectionType,
} from '@quicktvui/quicktvui3';
import { IActivityConfig, topModes } from '../../api/activity2/types'
import { config } from '../../api/activity2/config'

export const getBgColor = (bColor?:string|object)=>{
  if(!bColor) return false
  return (typeof bColor === 'string') ? {colors:[bColor,bColor],cornerRadius:0} : bColor
}
export const dConfig = {
  bgColor: getBgColor(config.bgColor) || {colors:['#2F3541','#252930'],cornerRadius:0},
  bgImg: config.bgImg, //|| 'https://up.deskcity.org/pic_source/28/73/cd/2873cd9dc91fa720a498b043aebd4509.jpg',
  top: {
    mode: 'left-right',
    title: '页面标题',//海底冒险小剧场季卡
    titleStyle: {
      color: '#ffffff', fontSize: '50px'
    },
    btnListWidth: 330
  },
  banner: {
    // img: 'https://up.deskcity.org/pic_source/28/73/cd/2873cd9dc91fa720a498b043aebd4509.jpg',
    // style: { height: '600px' }
  },
  block: {
    title: '板块标题',
    pStyle:{ marginBottom: '100px' },
    pTitleStyle: { fontSize: '36px', color: '#ffffff' }
  }
}

const dSpace = 35//poster间距
const dBlackSpace = 90//板块间距
const dBlackItemWidth = 260
const dBlackItemHeight = 320
const dPosterTitleHeight = 50
const dPosterSubTitleHeight = 30
const dPosterBottom = 30
const dPosterHeight = dBlackItemHeight +dPosterTitleHeight+dPosterSubTitleHeight
export const blockWidth = 1920
export const blockHeight = 950
export const getPosterItemList =(sectionId: string): Array<QTWaterfallItem> =>{
  let data: Array<QTWaterfallItem> = [];
  let imgURL = 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750';
  for (let i = 0; i < 10; i++) {
    const poster: QTPoster = {
      _id: sectionId + '_' + i,
      focus: {
        enable: true,
        scale: 1.08,
        border: false,
      },
      type: 1,//10001
      decoration: {
        left: 0,
        right: dSpace,
        bottom: dPosterBottom,
      },
      style: {
        width: dBlackItemWidth,
        height: dPosterHeight,
      },
      image: {
        src: imgURL,
        enable: true,
        style: {
          width: dBlackItemWidth,
          height: dBlackItemHeight,
        },
      },
      corner: {
        text: '角标',
        enable: true,
        style: {
          width: dBlackItemWidth,
        },
        background: { colors: ['#FE3824', '#F0051E'], cornerRadii4: [0, 8, 0, 8], orientation: 2, },
      },
      score: {
        text: i+'',
        enable: true,
        style: {
          width: dBlackItemWidth,
          height: 30,
        },
      },
      title: {
        text: '主标题',
        enable: true,
        style: {
          width: dBlackItemWidth,
          height: dPosterTitleHeight
        },
      },
      // subTitle: {
      //   text: '副标题',
      //   enable: true,
      //   style: {
      //     width: dBlackItemWidth,
      //     height: dPosterSubTitleHeight
      //   },
      // },
      floatTitle: {
        text: '浮动标题',
        enable: true,
        style: {
          width: dBlackItemWidth,
        },
      },
      titleStyle: {
        width: dBlackItemWidth,
        marginTop: 320 - 60,
      },
      focusTitle: {
        text: '主标题----',
        enable: true
      },
      titleFocusStyle: {
        width: dBlackItemWidth,
        marginTop: 320 - 100
      }
    };
    data.push(poster);
  }
  return data;
}
export const getBlockList = ()=>{
  let sectionList: Array<QTWaterfallSection> = [];
    for (let i = 0; i < 2; i++) {
      let section: QTWaterfallSection = {
        _id: '' + i,
        type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
        title: '板块:' + i,
        titleStyle: {
          marginTop: 10,
          marginBottom: 10,
          fontSize: 36,
        },
        //3.构造section中item列表数据
        itemList: getPosterItemList(i + ''),
        style: {
          width: blockWidth,
          height: -1,
        },
        decoration: {
          left: dBlackSpace,
          right: dBlackSpace - dSpace
        }
      };
      sectionList.push(section);
    }
    return sectionList
}