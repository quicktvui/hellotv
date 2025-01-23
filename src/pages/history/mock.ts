import { numberToChinese } from '../../tools'

export interface Item {
  type: number
  itemSize: number
  title?: string
  progress?: string
  image?: string
  decoration?: any
}

export const buildMockData = (tag: string = '观看历史', limit: number = 100): Item[] => {
  let arr: Item[] = []
  for (let i = 1; i <= limit; i++) {
    arr.push({
      type: 1,
      itemSize: 266,
      title: `${tag}：第${numberToChinese(i)}回`,
      progress: `${i}%`,
      image: 'https://extcdn.hsrc.tv/channelzero_image/2023/12/15/5e84c591-038c-47d1-a266-46058d229d3b.png',
      decoration: { left: 20, top: 20, right: 20, bottom: 20 }
    })
  }
  // 到底提示
  arr.push({ type: 1002, itemSize: 100, decoration: { bottom: 140 } })

  return arr
}
