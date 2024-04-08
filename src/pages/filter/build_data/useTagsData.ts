import { Tags } from "./impl/Tags";
import { QTListViewItem } from "@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItem";
import {
  _filter_line_height, _filter_record_height, _filter_tag_gap, _filter_text_height,
  buildFilterAdapter,
  buildTagContentsAdapter,
  buildTagsAdapter
} from './tags/TagsAdapter'
import { TagContent } from "./impl/TagContent";
import { QTGridViewItem } from "@quicktvui/quicktvui3";
import { FilterCondition } from "./impl/FilterCondition";
import { FilterConditionList } from "./impl/FilterConditionList";
import SearchConfig from "../../search/build_data/SearchConfig"

let defaultOffSetIndex = 0
let defaultTagSelectIndex = 0
let allFilterList: Array<FilterConditionList> = []
let fastFilterList: FilterConditionList = {}
let rootTag: string = ""
let isOffsetY = false
let curRecord: Array<QTListViewItem> = []

/**
 * 整理数据
 * @param tags 原始数据
 * @param defaultSelectTag 默认选中的 tag
 * @param defaultFilters  默认选中的筛选条件
 * @param defaultFastTag 默认选中的快速筛选值
 */
export function buildTagsData(tags: any, defaultSelectTag?: string, defaultFilters?: Array<string>, defaultFastTag?: string): Array<QTListViewItem> {
  const tagsList: Array<Tags> = []
  const resTags: Array<any> = tags.tags
  //是否添加筛选 tag
  const itemScreenTag: Tags = buildScreenTag(tags.filterList)
  if (itemScreenTag) tagsList.push(itemScreenTag)
  //build筛选条件数据
  buildFiltersCondition(tags.filterList, defaultFilters, defaultFastTag)
  //整理筛选列表
  resTags.map((tag, index) => {
    const itemTag: Tags = {
      id: tag.id,
      typeName: tag.showType,
      isShowScreen: false,
      tagName: tag.tagName,
      showName: tag.showName,
      normalImg: tag.normalImage,
      selectedImg: tag.selectImage,
      focusedImg: tag.focusImage
    }
    if (defaultSelectTag === tag.tagName) {
      defaultTagSelectIndex = index + defaultOffSetIndex
    }
    tagsList.push(itemTag)
  })
  return buildTagsAdapter(tagsList)
}

export function buildScreenTag(filterList: Array<any>) {
  let itemTag: Tags
  if (filterList && filterList.length > 0) {
    itemTag = {
      typeName: "1",
      isShowScreen: true,
      tagName: "筛选",
      showName: "筛选",
    }
    defaultOffSetIndex = 1
  }
  return itemTag
}

/**
 * 获取当前默认选中 tag
 */
export function getDefaultTagSelectIndex() {
  return defaultTagSelectIndex
}

/**
 * build 筛选条件数据
 * @param filterList
 */
export function buildFiltersCondition(filterList: Array<any>, defaultFilter?: Array<string>, defaultFastTag?: string) {
  allFilterList = []
  fastFilterList = []
  if (filterList && filterList.length > 0) {
    filterList.forEach(f => {
      let defaultSelectPosition = -1
      let filtersLine: FilterConditionList = {
        defaultSelectPosition: -1,
        list: []
      }
      const groupType = f.groupType // 1:快速筛选 其他：普通筛选

      if (groupType !== '1' && groupType !== 1) {
        //添加全部标签
        filtersLine.list?.push({
          filterShowName: f.allName,
          filterTagName: f.allName,
          selected: true,
        })
        defaultSelectPosition = 0
      }
      //添加剩余标签
      f.tags.forEach((t, tIndex) => {
        const filterCondition: FilterCondition = {
          filterShowName: t.showName,
          filterTagName: t.tagName,
          selected: false
        }
        if ((groupType == '1' || groupType == 1)) {
          //设置快速筛选 默认选中数据
          if (defaultFastTag && filterCondition.filterShowName === defaultFastTag) {
            filterCondition.selected = true
            //tIndex+1 因为默认最前面有一条头部提示
            defaultSelectPosition = tIndex
          }
        }
        //设置默认筛选条件选中
        else if (defaultFilter && defaultFilter.length > 0) {
          for (let i = 0; i < defaultFilter.length; i++) {
            if (defaultFilter[i] === filterCondition.filterShowName) {
              if (filtersLine.list) {
                filtersLine.list[0].selected = false
              }
              filterCondition.selected = true
              defaultSelectPosition = (tIndex + 1)
              defaultFilter.splice(i, 1)//删除当前已经设置的条件
              break
            }
          }
        }
        filtersLine.list?.push(filterCondition)
      })
      filtersLine.defaultSelectPosition = defaultSelectPosition
      //快速标签赋值 有且只有一组快速标签被展示
      if (groupType == '1' || groupType == 1) {
        fastFilterList = filtersLine
      } else {
        allFilterList.push(filtersLine)
      }
    })
  }
}

export function getFilterConditionData(): Array<QTListViewItem> {
  return buildFilterAdapter(allFilterList, fastFilterList)
}

export function updateFastFilterCondition(itemPosition) {
  if (fastFilterList) {
    fastFilterList.defaultSelectPosition = (itemPosition - 1)
  }
}

export function updateAllFilterCondition(parentPosition, itemPosition) {
  if (allFilterList && allFilterList.length > parentPosition) {
    const itemFilter = allFilterList[parentPosition]
    if (itemFilter) {
      itemFilter.defaultSelectPosition = itemPosition
    }
  }
}

export function clearAllFilterCondition(position) {
  if (allFilterList && allFilterList.length > 0) {
    allFilterList.forEach(item => {
      item.defaultSelectPosition = position
    })
  }
}
export function clearFastFilterCondition() {
  if (fastFilterList) {
    fastFilterList.defaultSelectPosition = -1
  }
}

export function getFilterLength(): number {
  const length = (allFilterList?.length || 0) + ((isFastFilterListMore() ? 1 : 0))
  return length > 8 ? 8 : length
}

export function getFilterHeight() {
  const filterLength = getFilterLength()
  if (filterLength > 0) {
    const isFastMore = isFastFilterListMore()
    return filterLength * _filter_text_height + (filterLength - (isFastMore ? 2 : 1)) * _filter_tag_gap + (isFastMore ? _filter_line_height : 0)
  }
  return 0
}

function isFastFilterListMore(): boolean {
  return (fastFilterList && fastFilterList.list && fastFilterList.list.length > 0) || false
}

export function getScrollHeight() {
  const filterHeight = getFilterHeight()
  if (isOffsetY) {
    return filterHeight > _filter_record_height ? (filterHeight - _filter_record_height) : filterHeight
  } else {
    return filterHeight
  }

}


export function buildScreenContent(tagContents: Array<any>, pageNum?: number): Array<QTGridViewItem> {
  const tagContentArray: Array<TagContent> = []
  tagContents.forEach((content, index) => {
    const tagContent: TagContent = {
      id: content.id,
      title: content.assetTitle,
      poster: content.coverV,
      score: content.doubanScore,
      cornerImg: content.cornerImage,
      actionRedirect: content.actionRedirect
    }
    tagContentArray.push(tagContent)
  })
  return buildTagContentsAdapter(tagContentArray, pageNum)
}

export function setRootTag(tag: string) {
  rootTag = tag
}

export function getRootTag() {
  return rootTag
}

export function getAllFilterList() {
  return allFilterList
}

export function getCurScreenCondition() {
  let condition = ""
  let showCondition = ""
  //快速筛选
  const defaultFastSelectPosition = fastFilterList.defaultSelectPosition ?? -1
  if (defaultFastSelectPosition > -1 && fastFilterList && fastFilterList.list && fastFilterList.list.length > defaultFastSelectPosition) {
    condition += fastFilterList.list[defaultFastSelectPosition].filterShowName
    showCondition += fastFilterList.list[defaultFastSelectPosition].filterShowName
  }
  //普通筛选
  else {
    let isFirstSetCondition = true
    allFilterList.forEach((item, index) => {
      const selectP = item.defaultSelectPosition || 0
      if (selectP > 0) {
        if (isFirstSetCondition) {
          condition += item.list![selectP].filterShowName
          showCondition += item.list![selectP].filterShowName
          isFirstSetCondition = false
        } else {
          condition += ("," + item.list![selectP].filterShowName)
          showCondition += ("," + item.list![selectP].filterShowName)
        }
      }
    })
  }
  if (condition) {
    isOffsetY = true
  } else {
    isOffsetY = false
  }
  setCurRecordFilter(showCondition)
  return getRootTag() + "," + condition
}

function setCurRecordFilter(condition) {
  curRecord = []
  if (condition) {
    condition.split(",").forEach(filter => {
      const item: QTListViewItem = {
        type: 14,
        recordFilterName: filter,
        decoration: {
          right: 16
        }
      }
      curRecord.push(item)
    })
  }
}

export function getCurRecordFilter(): Array<QTListViewItem> {
  return curRecord
}

export function getOffsetY() {
  return isOffsetY
}

export function isFastFilterListHasData() {
  return fastFilterList && fastFilterList.list && fastFilterList.list.length > 0
}

export function isAllFilterListHasData() {
  return allFilterList && allFilterList.length > 0
}
