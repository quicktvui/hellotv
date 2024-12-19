import { Filters, Contents } from 'src/api/filter/interface'
import { gridContent, primary, secondary, tertiary } from './interface'

export const buildFilters = function (rawData: Filters): { primaries: primary[]; secondaries: secondary[]; tertiaries: tertiary[] } {
  // 一级列表, 左侧扩展
  const primaries: primary[] = rawData.primary.map((item) => ({ type: 1, ...item }))

  // 二级列表, 左侧筛选项
  const secondaries: secondary[] = [
    { type: 1, id: '', name: '电视剧' },
    { type: 2, id: '', name: '筛选' },
    ...rawData.secondary.map((item) => ({ type: 3, ...item }))
  ]

  // 三级列表, 右侧筛选条件
  const tertiaries: tertiary[] = []
  rawData.tertiary.forEach((item) => {
    const tertiary = {
      type: 1,
      groupKey: item.groupKey,
      groupName: item.groupName,
      list: item.tags.map((tag) => ({ type: 1, ...tag })),
      defaultSelectedPos: 0
    }
    tertiary.list.unshift({ type: 1, id: '', name: item.groupName })
    tertiaries.push(tertiary)
  })

  return { primaries, secondaries, tertiaries }
}

export const buildContents = function (rawData: Contents): gridContent[] {
  const contents: gridContent[] = []

  rawData.items.forEach((item) => {
    contents.push({
      type: 1,
      decoration: { right: 40, bottom: 40 },
      title: item.title,
      cover: item.cover,
      jumpParams: item.jumpParams
    })
  })

  return contents
}
