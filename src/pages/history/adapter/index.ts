import { Records } from '../api/interface'
import { Content, ContentType } from './interface'

export const buildContents = (records: Records): Content[] => {
  const contents: Content[] = []

  if (records.items.length > 0) {
    records.items.forEach((item, index) => {
      contents.push({
        type: ContentType.Normal,
        itemSize: 266,
        id: item.id,
        title: item.title,
        progress: `${Math.floor((item.viewedDuration / item.totalDuration) * 100)}%`,
        image: item.coverH,
        decoration: { left: 20, top: 20, right: 20, bottom: 20 }
      })
    })
  }

  return contents
}

export const buildEndContent = (): Content => {
  return {
    type: ContentType.End,
    itemSize: 100,
    id: '',
    decoration: { bottom: 140 }
  }
}
