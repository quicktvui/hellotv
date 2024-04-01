import {QTPoster, QTWaterfallItemType} from "@quicktvui/quicktvui3";
import {TabSectionItem} from "./impl/TabSectionItem";
import {QTPosterTitle} from "@quicktvui/quicktvui3/dist/src/poster/core/QTPosterTitle";
import {QTPosterRipple} from "@quicktvui/quicktvui3/dist/src/poster/core/QTPosterRipple";
import {QTWaterfallFlexStyle} from "@quicktvui/quicktvui3/dist/src/waterfall/core/QTWaterfallFlexStyle";
import {QTPosterCorner} from "@quicktvui/quicktvui3/dist/src/poster/core/QTPosterCorner";
import ic_water_play from "../../../../assets/ic_water_play.png"

/**
 * 标题展示样式 titleStyle
 * 0：压图 选中展示，
 * 1：图下方 选中可展示副标题
 * 2：图下方 选中不展示副标题
 * 3：不展示标题，选中展示
 * 其他：不展示标题，选中也不展示
 */
export function buildPoster(tabContentItem: TabSectionItem): QTPoster {
    const poster: QTPoster = {
        type: QTWaterfallItemType.QT_WATERFALL_ITEM_TYPE_POSTER,
        ripple: buildPosterRipple(tabContentItem),
        focus: {
          enable: true,
          scale: 1.03
        },
        image: {
            src: tabContentItem.poster,
            enable: true,
            style: {
                width: tabContentItem.width,
                height: tabContentItem.height,
            }
        },
        title: buildPosterTitle(tabContentItem),
        subTitle: buildPosterSubTitle(tabContentItem),
        floatTitle: buildPosterFloatTitle(tabContentItem),
        style: {
            width: tabContentItem.width,
            height: tabContentItem.height,
            x: tabContentItem.posX,
            y: tabContentItem.posY
        },
        titleStyle: buildTitleStyle(tabContentItem),
        focusTitle:buildPosterFocusTitle(tabContentItem),
        titleFocusStyle: {width: tabContentItem.width, marginTop: tabContentItem.height - 100},
        corner: buildPosterCorner(tabContentItem),
        item: tabContentItem//
    }
    poster.isBgPlayer = tabContentItem.isBgPlayer
    return poster
}

function buildTitleStyle(tabContentItem: TabSectionItem): QTWaterfallFlexStyle {
  //标题展示样式 titleStyle 0：压图 选中展示，1：图下方 选中可展示副标题 2：图下方 选中不展示副标题 3：不展示标题，选中展示 其他：不展示标题，选中也不展示
    let itemHeight: number
    const style = tabContentItem.posterTitleStyle
    if (style === '0' || style === '1' || style === '2'){
      itemHeight = 120
    }else{
      itemHeight = 0
    }
    return {
      width: tabContentItem.width,
      height: itemHeight,
      marginTop: tabContentItem.height - 60,
    }
}


export function buildPosterTitle(tabContentItem: TabSectionItem): QTPosterTitle {
    //标题展示样式 titleStyle 0：压图 选中展示，1：图下方 选中可展示副标题 2：图下方 选中不展示副标题 3：不展示标题，选中展示 其他：不展示标题，选中也不展示
    const style = tabContentItem.posterTitleStyle
    let enableTitle = false
    switch (style) {
        case '0':
            enableTitle = false
            break
        case '1':
            enableTitle = true
            break
        case '2':
            enableTitle = true
            break
        case '3':
            enableTitle = true
            break
        case '4':
            enableTitle = false
            break
        default:
            break
    }
    return {
        text: tabContentItem.posterTitle,
        enable: enableTitle,
        style: {
            width: tabContentItem.width,
        }
    }
}

export function buildPosterFocusTitle(tabContentItem: TabSectionItem): QTPosterTitle {
  //标题展示样式 titleStyle 0：压图 选中展示，1：图下方 选中可展示副标题 2：图下方 选中不展示副标题 3：不展示标题，选中展示 其他：不展示标题，选中也不展示
  const style = tabContentItem.posterTitleStyle
  let enableTitle = false
  switch (style) {
    case '0':
      enableTitle = true
      break
    case '1':
      enableTitle = true
      break
    case '2':
      enableTitle = true
      break
    case '3':
      enableTitle = true
      break
    case '4':
      enableTitle = false
      break
    default:
      break
  }
  return {
    text: tabContentItem.posterTitle,
    enable: enableTitle,
    style: {
      width: tabContentItem.width,
    }
  }
}


export function buildPosterSubTitle(tabContentItem: TabSectionItem): QTPosterTitle {
    const style = tabContentItem.posterTitleStyle
    let subTitle = tabContentItem.posterSubtitle
    let enableTitle = subTitle !== "" && style != '2' && style != '4'
    return {
        text: subTitle??"",
        enable: enableTitle,
        style: {
            width: tabContentItem.width,
        }
    }
}

export function buildPosterFloatTitle(tabContentItem: TabSectionItem): QTPosterTitle {
    const style = tabContentItem.posterTitleStyle
    const floatTitle = tabContentItem.floatTitle
    let enableTitle: boolean
    let titleText = ''
    switch (style) {
        case '0':
            enableTitle = true
            titleText = tabContentItem.posterTitle
            break
        case '1':
        case '2':
            enableTitle = (floatTitle != "" && floatTitle != undefined)
            titleText = (floatTitle ?? "")
            break
        default:
            enableTitle = false
            break
    }
    return {
        text: titleText,
        enable: enableTitle,
        style: {
            width: tabContentItem.width,
        },
        background: {colors: ['#e5000000', '#00000000'], orientation: 4}
    }
}

export function buildPosterRipple(tabContentItem: TabSectionItem): QTPosterRipple {
    return {
        enable: tabContentItem.playLogoSwitch == '1',
        src: ic_water_play,
        style: {
            right: 0,
            bottom: 0,
            marginRight: -12,
        }
    }
}

export function buildPosterCorner(tabContentItem: TabSectionItem): QTPosterCorner {
    const cornerContent = tabContentItem.cornerContent
    const cornerColor = tabContentItem.cornerColor
    const cornerGradient = tabContentItem.cornerGradient || cornerColor
    return {
        text: cornerContent+"",
        enable: cornerContent != '' && cornerContent != null && cornerContent != 'null',
        style: {
            width: tabContentItem.width,
            height: 30
        },
        background: {
            colors: [cornerColor ? cornerColor : '#ffB67827', cornerGradient ? cornerGradient : '#ffB67827'],
            cornerRadii4: [0, 8, 0, 8],
            orientation: 2
        }
    }
}
