//waterfall 内容配置
export const TabContentConfig = {
  //首页内容请求数量
  sectionLoadLimit: 10,
  //板块间距
  sectionGap: 40,
  //板块标题字体大小
  sectionTitleFontSize:42,
  //板块标题默认高度,后台如果是图片标题，高度从后台获取
  sectionTitleHeightDefault : 60,
  //格子和板块标题，格子之间间距
  sectionItemGap:40,
  //格子标题高度
  sectionItemHeight:60,
  //整体距离左侧距离
  decorationLeftGap:80,
  //首个板块距离顶部距离
  firstSectionTop:219,
  //单 tab 时，首个section 距离顶部的偏移量
  firstSectionOffsetY:-80
}
//waterfall item类型
export const TabContentItemType = {
  TYPE_ITEM_SECTION_NO_TITLE : 0,//带边框无标题格子
  TYPE_ITEM_SECTION_HAS_TITLE : 1,//带标题格子(上方/下方)
  TYPE_ITEM_SECTION_PLACE_HOLDER : 3,//占位格子
  TYPE_ITEM_HISTORY_TEXT: 4,//历史格子-文字
  TYPE_ITEM_HISTORY_IMG: 5,//历史格子-图片
  TYPE_ITEM_SECTION_FOCUS_CHANGE_IMG : 6,//焦点变图格子
  TYPE_ITEM_SECTION_CELL_PLAYER:7,//小窗播放
  TYPE_ITEM_SECTION_CELL_PLAYER_LIST:8,//小窗列表播放
  TYPE_ITEM_SECTION_LOOP_IMG:9,//轮播图片格子
  TYPE_WATERFALL_SECTION_4K:10001,//4K section
  TYPE_WATERFALL_SECTION_4K_ITEM:10,//4K 格子
  TYPE_WATERFALL_SECTION_SMALL_4K:10002,//放映厅 小 4K section
  TYPE_WATERFALL_SECTION_SMALL_4K_ITEM:11,//小 4K 格子
}