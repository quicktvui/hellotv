import {TabSectionItem} from "./impl/TabSectionItem";
import {QTWaterfallItem, QTWaterfallItemType} from "@quicktvui/quicktvui3";
import TabSectionType from "./tab_content_type/TabSectionType";
import {TabSectionItemType} from "./tab_content_type/TabSectionItemType";


export function buildTabPageStateImageItem(tabContentItem: TabSectionItem,cellType:string): QTWaterfallItem {
  let image:string | undefined
  image =( cellType === TabSectionItemType.TAB_CONTENT_ITEM_FOCUS_CHANGE_IMG)?tabContentItem.nonFocusImage:tabContentItem.poster
  let item: QTWaterfallItem = {
    type: TabSectionType.TYPE_ITEM_SECTION_FOCUS_CHANGE_IMG,
    style: {
      width: tabContentItem.width,
      height: tabContentItem.height,
      x: tabContentItem.posX,
      y: tabContentItem.posY,
    },
    size:[tabContentItem.width, tabContentItem.height],
    shimmer:{
      enable:true
    },
    image: image,
    selectedImage: tabContentItem.nonFocusImage,
    focusedImage: tabContentItem.focusImage,
    item: tabContentItem//
  }
  item.isBgPlayer = tabContentItem.isBgPlayer
  return item
}


export function buildTabPageBlankItem(tabContentItem: TabSectionItem): QTWaterfallItem {
  return {
      type: QTWaterfallItemType.QT_WATERFALL_ITEM_TYPE_BLANK,
      style: {
        width: tabContentItem.width,
        height: tabContentItem.height,
        x: tabContentItem.posX,
        y: tabContentItem.posY
      },
      image: tabContentItem.poster
    }
}

export function buildTabPageCellPlayerItem(tabContentItem: TabSectionItem,tabIndex): QTWaterfallItem{
  let item: QTWaterfallItem = {
    type: TabSectionType.TYPE_ITEM_SECTION_CELL_PLAYER,
    focusScrollTarget:true,
    list: [],
    sid: tabContentItem.id + 'cellSid'+'tabIndex'+tabIndex,
    childSID: 'bg-player',
    size:[tabContentItem.width,tabContentItem.height],
    pLayout:[tabContentItem.posX, tabContentItem.posY, tabContentItem.width, tabContentItem.height],
    // pLayout:[pd.posX, pd.posY, 728, 409,],
    placeholderLayout:[-5,-5,tabContentItem.width,tabContentItem.height],
    imgSrc : tabContentItem.poster,
    isCellPlayer:true,
    isCellPlayerList: tabContentItem.cellType == TabSectionItemType.TAB_CONTENT_ITEM_CELL_PLAYER_LIST,
    playData: tabContentItem.playData ? tabContentItem.playData : null,
    showList : tabContentItem.width > 1200,
    image: {
      src: tabContentItem.poster,
      enable: true,
      style: {
        width: tabContentItem.width,
        height: tabContentItem.height,
      }
    },
    style: {
      width: tabContentItem.width,
      height: tabContentItem.height,
      x: tabContentItem.posX,
      y: tabContentItem.posY
    },
    ...tabContentItem
  }

  return item
}
