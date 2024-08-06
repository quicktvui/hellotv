import {
  QTPoster,
  QTWaterfallItem,
  QTWaterfallSection,
  QTWaterfallSectionType,
} from "@quicktvui/quicktvui3";
import { IActivityConfig, IActivityTopBtnConfig } from "../../api/activity2/types";
import ThemeConfig from "../../build/ThemeConfig";

export const getBgColor = (bColor?: string | object) => {
  if (!bColor) return "";
  return typeof bColor === "string" ? { colors: [bColor, bColor], cornerRadius: 0 } : bColor;
};

const dSpace = 35; //poster间距
const dBlackSpace = 90; //板块间距
const dBlackItemWidth = 260;
const dBlackItemHeight = 320;
const dPosterTitleHeight = 50;
const dPosterSubTitleHeight = 30;
const dPosterBottom = 20;
const dPosterHeight = dBlackItemHeight + dPosterTitleHeight + dPosterSubTitleHeight;
const dBlockTitleBottom = 30;
const dBlockTitleFontSize = 50;
const dBlockTitleDecorationTop = 50;
export const dBlockWidth = 1920;
export const dBlockHeight = 1080;

interface Ioptions {
  //Partial
  space?: number;
  posterBottom?: number;
  blackItemWidth?: number;
  posterHeight?: number;
  blackItemHeight?: number;
  posterTitleHeight?: number;
  posterSubTitleHeight?: number;
  columns?: number;
}
export const activity_redirectTypes = {
  innerRouter: 1, //跳转到当前app内部页面
  innerApp: 0, //跳转到内部其他app
};

export interface IBlockItemData {
  id: string;
  img: string;
  title?: string;
  subTitle?: string;
  floatTitle?: string;
  corner?: string;
  cornerBackground?: string | object;
  score?: string;
  focusTitle?: string;
  layout?: { x: number; y: number; width: number; height: number }; // 图片宽度优先级 layout > columns > blackItemWidth
  _router?: { url: string; params?: object }; //当前app内部路由地址
  _action?: string; // 内部其他app地址
  _redirectType?: number; //跳转类型，取值见activity_redirectTypes
  [k: string]: any;
}

export const getPosterItemList = (
  data: IBlockItemData,
  options: Ioptions = {}
): QTWaterfallItem => {
  let {
    space = dSpace,
    posterBottom = dPosterBottom,
    blackItemWidth = dBlackItemWidth,
    posterHeight = dPosterHeight,
    blackItemHeight = dBlackItemHeight,
    posterTitleHeight = dPosterTitleHeight,
    posterSubTitleHeight = dPosterSubTitleHeight,
  } = options;

  return {
    _id: data._sectionItemId,
    _router: data._router,
    _action: data._action,
    _redirectType: data._redirectType,
    layout: data.layout
      ? [data.layout?.x, data.layout?.y, data.layout?.width, data.layout?.height]
      : undefined,
    focus: {
      enable: true,
      scale: 1.002,
      border: false,
    },
    type: 1, //10001
    decoration: {
      left: 0,
      right: space,
      bottom: posterBottom,
    },
    style: {
      width: blackItemWidth,
      height: posterHeight,
    },
    image: {
      src: data.img,
      enable: !!data.img,
      style: {
        width: blackItemWidth,
        height: blackItemHeight,
      },
    },
    corner: {
      text: data.corner,
      enable: !!data.corner,
      style: {
        width: blackItemWidth,
      },
      background: getBgColor(data.cornerBackground) || {
        colors: ["#FFE398", "#EEB364"],
        cornerRadii4: [0, 8, 0, 8],
        orientation: 2,
      },
    },
    score: {
      text: data.score,
      enable: !!data.score,
      style: {
        width: blackItemWidth,
        height: 30,
      },
    },
    title: {
      text: data.title,
      enable: !!data.title,
      style: {
        width: blackItemWidth,
        height: posterTitleHeight,
      },
    },
    subTitle: {
      text: data.subTitle,
      enable: !!data.subTitle,
      style: {
        width: blackItemWidth,
        height: posterSubTitleHeight,
      },
    },
    floatTitle: {
      text: data.floatTitle,
      enable: !!data.floatTitle,
      style: {
        width: blackItemWidth,
      },
    },
    titleStyle: {
      width: blackItemWidth,
      marginTop: blackItemHeight - 60,
    },
    focusTitle: {
      text: data.focusTitle || data.title,
      enable: !!(data.focusTitle || data.title),
    },
    titleFocusStyle: {
      width: blackItemWidth,
      marginTop: blackItemHeight - 100,
    },
  };
};

interface IBlockData {
  id: string;
  title?: string;
  list: IBlockItemData[];
  options: IblockOptions;
}

interface IblockOptions extends Ioptions {
  decorationLeft?: number;
  blockTitleFontSize?: number;
  blockTitleBottom?: number;
  blockTitleDecorationTop?: number;
}

export interface IacTivity2GetFlexBlockRes {
  section: QTWaterfallSection;
  blockHeight: number;
}

export const getActivity2FlexBlock = (
  data: IBlockData,
  sectionType: number = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX
): IacTivity2GetFlexBlockRes => {
  let {
    blackItemWidth = dBlackItemWidth,
    columns = 0,
    space = dSpace,
    blackItemHeight = dBlackItemHeight,
    posterTitleHeight = dPosterTitleHeight,
    posterSubTitleHeight = dPosterSubTitleHeight,
    blockTitleBottom = dBlockTitleBottom,
    blockTitleFontSize = dBlockTitleFontSize,
    blockTitleDecorationTop = dBlockTitleDecorationTop,
  } = data.options;

  let isLayout = false;
  const layoutIndex = data.list.findIndex((item) => {
    isLayout = !!item?.layout;
    return item && item.layout && item.layout.y != 0;
  });
  if (isLayout) {
    columns = layoutIndex > 0 ? layoutIndex : 1;
  }

  const leftSpace = data.options.decorationLeft || dBlackSpace;
  const rightSpace = dBlackSpace - space;
  const contentWidth = dBlockWidth - leftSpace - rightSpace - space * columns;
  if (columns && !isLayout) {
    blackItemWidth = Math.floor(contentWidth / columns);
  }
  if (!data.title) {
    blockTitleBottom = 0;
    blockTitleFontSize = 0;
  }
  // const rows = columns ? Math.ceil(data.list.length/columns) : 1
  // const ratio = Math.ceil(dBlackItemWidth / dBlackItemWidth)
  let rowsHeight = 0;
  let blockHeight = blockTitleBottom + blockTitleFontSize + blockTitleDecorationTop;

  let _columns = columns || 1;
  const itemlist = data.list
    .filter((item) => item.img)
    .map((item, index) => {
      let posterHeight = item.layout?.height || blackItemHeight;
      if (!isLayout) {
        if (item.title) {
          posterHeight += posterTitleHeight;
        }
        if (item.subTitle) {
          posterHeight += posterSubTitleHeight;
        }
      }
      if (isLayout) {
        blackItemWidth = item.layout?.width || blackItemWidth;
        blackItemHeight = item.layout?.height || blackItemWidth;
        // if(item.title){ blackItemHeight -= posterTitleHeight }
        // if(item.subTitle){ blackItemHeight -= posterSubTitleHeight }
      }

      if (index === 0 || index % _columns == 1) {
        rowsHeight = posterHeight;
      } else {
        rowsHeight = Math.max(rowsHeight, posterHeight);
      }
      if (index % _columns == 1 || index == data.list.length - 1) {
        blockHeight += rowsHeight;
      }
      return getPosterItemList(
        { ...item, _sectionItemId: data.id + item.id + index },
        {
          ...data.options,
          blackItemWidth,
          posterHeight,
          blackItemHeight,
        }
      );
    });

  const section = {
    _id: data.id,
    type: sectionType, //QT_WATERFALL_SECTION_TYPE_FLEX
    title: data.title || "",
    titleStyle: {
      // marginTop: 10,
      marginBottom: blockTitleBottom,
      fontSize: blockTitleFontSize,
      height: data.title ? blockTitleFontSize : 10,
      width: 1000,
    },
    //3.构造section中item列表数据
    itemList: itemlist,
    style: {
      width: dBlockWidth - leftSpace - rightSpace,
      // height: blockHeight,
    },
    decoration: {
      left: leftSpace,
      right: rightSpace,
      top: blockTitleDecorationTop,
    },
  };
  return { section, blockHeight: itemlist.length ? blockHeight : 0 };
};

export const endSection: QTWaterfallSection = {
  _id: "end-100",
  type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
  title: "已经到底啦，按【返回键】回到顶部",
  titleStyle: {
    width: 1920,
    height: 100,
    // marginLeft: 90,
    // marginTop: 40,
    // marginBottom: 40,
    fontSize: 50,
  },
  itemList: [],
  style: {
    width: 1920,
    height: 200,
  },
};

export const emptySection: QTWaterfallSection = {
  _id: "empty-100",
  type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
  // title: 'end',
  titleStyle: {},
  itemList: [],
  style: { width: 1920, height: 200 },
};

export const getBlockList = (arr: IacTivity2GetFlexBlockRes[] = []) => {
  console.log(arr, "--lsj-arr");
  // 一年级数英同步课堂下册 剑桥英语 一年级语文强化课程
  let waterfallHeight = 0;
  let sectionList: Array<QTWaterfallSection> = arr
    .filter((item) => item.blockHeight)
    .map((item) => {
      waterfallHeight += item.blockHeight;
      return item.section;
    });
  if (waterfallHeight < dBlockHeight) {
    sectionList.push(emptySection);
  } else {
    sectionList.push(endSection);
  }
  return { sectionList, waterfallHeight };
};

// getActivity2FlexBlock( //左侧让出空隙
//   { id: '1', title: '', list: [{id: '1'},{id:'2'},{id:'3'},{id:'4'},{id: '5'},{id:'6'},{id:'7'},{id:'8'}] },
//   { columns: 4, decorationLeft: 600 }
// ),

export const getActivityTopBtn = (options: IActivityTopBtnConfig) => {
  return {
    type: options.type || 2, //1 带图标，2不带图标
    decoration: { left: 20 },
    text: options.text,
    background: { colors: options.background || ThemeConfig.btnGradientColor, cornerRadius: 25 },
    focusedBackground: {
      colors: options.focusedBackground || ThemeConfig.btnGradientFocusColor,
      cornerRadius: 25,
    },
    icon: options.icon,
    focusIcon: options.focusIcon,
    textColor: options.textColor || ThemeConfig.textColor,
    textFocusColor: options.textFocusColor || ThemeConfig.textFocusColor,
    _router: options._router,
  };
};
