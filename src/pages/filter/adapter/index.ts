import { QTListViewItem } from '@quicktvui/quicktvui3'
import { Filters, Contents } from '../../../api/filter/interface'
import {
  GridContent,
  GridContentType,
  ListItemType,
  Primary,
  PrimaryType,
  Secondary,
  SecondaryType,
  Tertiary,
  TertiaryType
} from './interface'
import config from '../config'
import icFilterNormal from '../../../assets/filter/ic_filter_normal.png'
import icFilterFocused from '../../../assets/filter/ic_filter_focused.png'
import icFilterSelected from '../../../assets/filter/ic_filter_selected.png'
import icLeftNormal from '../../../assets/filter/ic_left_normal.png'
import icLeftFocused from '../../../assets/filter/ic_left_focused.png'
import icLeftSelected from '../../../assets/filter/ic_left_selected.png'

/**
 * 构建一级、二级、三级筛选项
 * @param primaryId 一级筛选项ID
 * @param rawData 原始数据
 * @returns
 */
export const buildFilters = function (
  primaryId: string,
  rawData: Filters
): { primaries: Primary[]; secondaries: Secondary[]; tertiaries: Tertiary[] } {
  // 一级列表, 左侧扩展
  const primaries: Primary[] = rawData.primary.map((item) => ({ type: PrimaryType.TEXT, ...item }))

  // 二级列表, 左侧筛选项
  const secondaries: Secondary[] = []
  switch (config.layoutMode) {
    case 1: // 单栏布局
      break
    case 2: // 两栏布局
      secondaries.push(
        ...[
          { type: SecondaryType.TITLE, id: '', name: primaries.find((item) => item.id === primaryId)?.name || '' },
          {
            type: SecondaryType.FILTER,
            id: '',
            name: '筛选',
            icon: { normal: 'file://' + icFilterNormal, focused: 'file://' + icFilterFocused, selected: 'file://' + icFilterSelected }
          }
        ]
      )
      break
    case 3: // 三栏布局
      secondaries.push(
        ...[
          {
            type: SecondaryType.FILTER_TITLE,
            id: '',
            name: '全部' + primaries.find((item) => item.id === primaryId)?.name || '',
            icon: { normal: 'file://' + icLeftNormal, focused: 'file://' + icLeftFocused, selected: 'file://' + icLeftSelected }
          },
          { type: SecondaryType.LINE, id: '', name: 'line' }
        ]
      )
      break
  }
  secondaries.push(...rawData.secondary.map((item) => ({ type: 9, ...item })))

  // 三级列表, 右侧筛选条件
  const tertiaries: Tertiary[] = []
  rawData.tertiary.forEach((item, index) => {
    const tertiary = {
      type: TertiaryType.LIST,
      groupKey: item.groupKey,
      groupName: item.groupName,
      list: item.tags.map((tag) => ({ type: ListItemType.TEXT, ...tag })),
      defaultSelectedPos: 0
    }
    tertiary.list.unshift({ type: ListItemType.TEXT, id: `t-${index}`, name: item.groupName })
    tertiaries.push(tertiary)
  })

  // 优化内容区域焦点首次向上体验, 值需要全局唯一
  tertiaries[tertiaries.length - 1].list[0].sid = '--sid--'

  return { primaries, secondaries, tertiaries }
}

/**
 * 构建筛选内容组件数据
 * @param rawData 原始数据
 * @returns
 */
export const buildContents = function (rawData: Contents): GridContent[] {
  const contents: GridContent[] = []

  rawData.items.forEach((item) => {
    contents.push({
      type: config.gridItemMode === 1 ? GridContentType.HORIZONTAL : GridContentType.VERTICAL,
      decoration: { right: 40, bottom: 40 },
      id: item.id,
      title: item.title,
      cover: item.cover,
      jumpParams: item.jumpParams
    })
  })

  return contents
}

/**
 * 获取请求筛选内容查询参数
 * @param filters 筛选条件列表
 * @returns
 */
export const getContentsQuery = (filters: QTListViewItem[]): string[] => {
  const query: string[] = []

  filters.forEach((item) => {
    if (item.defaultSelectedPos > 0) {
      query.push(item.list[item.defaultSelectedPos].name)
    }
  })

  return query
}

/**
 * 判断是否需要添加到底提示
 * @param showConditions 是否展示筛选条件
 * @param gridDataLength 筛选内容数据条数
 * @returns
 */
export const shouldAddEndSection = (showConditions: boolean, gridDataLength: number): boolean => {
  const cfgGridSpanCount = config.gridSpanCount
  switch (config.gridItemMode) {
    case 1:
      return showConditions ? gridDataLength > cfgGridSpanCount * 2 : gridDataLength > cfgGridSpanCount * 3
    case 2:
      return showConditions ? gridDataLength > cfgGridSpanCount : gridDataLength > cfgGridSpanCount * 2
    default:
      return false
  }
}
