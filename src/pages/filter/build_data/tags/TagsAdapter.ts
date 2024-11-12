import FilterConfig from "../FilterConfig"
import {Tags} from "../impl/Tags";
import {QTListViewItem} from "@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItem";
import {ESListViewItemDecoration} from "@extscreen/es3-component";
import {QTListViewItem} from "@quicktvui/quicktvui3";
import {TagContent} from "../impl/TagContent";
import {FilterConditionList} from "../impl/FilterConditionList";

export const _filter_line_height:number = 61
export const _filter_text_height:number = FilterConfig.filterTextHeight
export const _filter_line_top_gap:number = 30
export const _filter_line_bottom_gap:number = 30
export const _filter_tag_gap:number = 12
export const _filter_record_height:number = FilterConfig.filterRecordHeight
export function getFilterMoreItem(): Array<QTListViewItem>{
  return _filter_more_item
}

let _filter_more_item: Array<QTListViewItem> = []

export function buildTagsAdapter(tags:Array<Tags>):Array<QTListViewItem>{
 const tagList:Array<QTListViewItem> = []
  tags.map((tag,index)=>{
    const decoration: ESListViewItemDecoration = {
      top:index === 0 ? 8 : 2
    }
    //typeName:1:文字，2：图片  tag.isShowScreen：true:带角标文字
    //type :1:纯文字，2：图片，3：带角标文字
    const type = (tag.typeName === '1' || !tag.typeName) ? (tag.isShowScreen ? 3 : 1) :2
   const tagItem:QTListViewItem = {
     type:type,
     showName:tag.showName,
     tagName:tag.tagName,
     normalImg:tag.normalImg,
     selectedImg:tag.selectedImg,
     focusedImg:tag.focusedImg,
     decoration,
   }
   tagList.push(tagItem)
  })
  return tagList
}

export function buildTagContentEnd():QTListViewItem{
  const endList: QTListViewItem = {
    type:1003,
    decoration:{top:30,bottom:10},
    text:"已经到底啦，按【返回键】回到顶部"
  }
  return endList
}

export function buildTagContentsAdapter(tagContents: Array<TagContent>, pageNum?:number, type?: number): Array<QTListViewItem> {
  const tagContentList: Array<QTListViewItem> = []
  const decoration: ESListViewItemDecoration = {
    top:18,
    bottom: type === 1 ? 18 : 35,
  }

  tagContents.forEach((content,index)=>{
    const gridItem:QTListViewItem ={
      type: type ?? 1,
      poster: content.poster,
      corner:{
        style:{
          width:0,
          height:0
        },
        src: content.cornerImg,
      },
      score: content.score,
      title: content.title,
      item: content.actionRedirect,
      decoration
    }
    tagContentList.push(gridItem)
  })

  //添加结束提示，首页小于 10条不加载结束提示
  if (tagContents.length > 0
    && ((tagContents.length < FilterConfig.screenPageSize && pageNum !== 1)
      || (pageNum === 1 && tagContents.length > 10 && tagContents.length < FilterConfig.screenPageSize))){
    tagContentList.push(buildTagContentEnd())
  }
  return tagContentList
}

export function buildFilterAdapter(allFilterList: Array<FilterConditionList>, fastFilterList?: FilterConditionList, moreLimit?: number): Array<QTListViewItem> {
  const resListView: Array<QTListViewItem> = []

  // 普通筛选
  allFilterList.forEach((row, rowIndex) => {
    const filterList: Array<QTListViewItem> = []
    row.list?.forEach((item, index) => {
      filterList.push({
        type: 11,
        filterShowName: item.filterShowName,
        filterTagName: item.filterTagName,
        selected: item.selected,
        decoration: {
          right: (index === row.list!.length - 1) ? 80 : 18
        }
      })
    })

    resListView.push({
      type: 1,
      filterLineStyle: { height: _filter_text_height },
      list: filterList,
      defaultSelectPosition: (fastFilterList?.defaultSelectPosition ?? -1) > -1 ? 0 : row.defaultSelectPosition,
      isFastList: false,
      decoration: {
        left: 30,
        bottom: (rowIndex !== (allFilterList.length - 1)) ? _filter_tag_gap : 0
      }
    })
  })

  // 更多筛选项
  const limit = moreLimit ?? -1
  // 判断是否需要添加更多筛选按钮
  if (limit > 0 && resListView.length > limit) {
    _filter_more_item = resListView.splice(limit, resListView.length - 1)
    resListView.push({
      type: 3,
      decoration: {
        left: 30
      },
    })
  }

  // 快速筛选
  if (fastFilterList && fastFilterList.list && fastFilterList.list.length > 0){
    resListView.push({
      type:2,
      filterLineStyle:{
        height:_filter_line_height
      },
      lineStyle:{
        height:1,
        width:((FilterConfig.isShowLeftList ? FilterConfig.rightContentWidth:1856) - 146)
      },
      decoration:{
        left:50,
        top:_filter_line_top_gap,
        bottom:_filter_line_bottom_gap
      }
    })
    const fastList:Array<QTListViewItem>=[]
    fastList.push({
      type:12,
      fastFilterTipStyle:{
        width:130,
        height:60
      },
      fastFilterTip:"还可以选",
      decoration:{
        right:18
      }
    })
    fastFilterList.list.forEach((fastItem,index)=>{
      const decoration: ESListViewItemDecoration = {
        right:index === fastItem.length-1 ? 80 : 18
      }
      const item:QTListViewItem = {
        type:13,
        filterShowName:fastItem.filterShowName,
        filterTagName:fastItem.filterTagName,
        selected:fastItem.selected,
        decoration
      }
      fastList.push(item)
    })
    resListView.push({
      type:1,
      filterLineStyle:{height:_filter_text_height},
      list:fastList,
      isFastList:true,
      defaultSelectPosition:fastFilterList.defaultSelectPosition+1,//因为 fastList push了一条还可以选的 item
      decoration:{
        left:50
      }
    })
  }

  return resListView
}
