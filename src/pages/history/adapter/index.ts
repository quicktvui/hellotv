import { Records, Item } from '../api/interface'
import { Content, ContentType } from './interface'
import config from '../config'

export const calculateProgress = (item: Item): string => {
  if (!item.episode) {
    return ''
  }
  return item.viewedDuration > 60000 ? `看至 ${Math.floor(item.viewedDuration / 60000)} 分钟` : '不足 1 分钟'
}

export const buildContent = (item: Item): Content => {
  return {
    type: config.gridItemMode === 1 ? ContentType.HORIZONTAL : ContentType.VERTICAL,
    itemSize: 266,
    id: item.id,
    title: item.title,
    progress: calculateProgress(item),
    image: item.coverH,
    showDeleteCover: false,
    decoration: { left: 20, top: 20, right: 20, bottom: 20 }
  }
}

export const buildContents = (records: Records): Content[] => {
  if (records.items.length === 0) {
    return []
  }

  const contents: Content[] = records.items.map(buildContent)

  return contents
}

export const buildEndContent = (): Content => {
  return {
    type: ContentType.End,
    itemSize: 100,
    id: '',
    decoration: { bottom: 20 }
  }
}
