import { QTWaterfallItem,QTWaterfallSection,QTWaterfallSectionType} from "@quicktvui/quicktvui3"
import { ShortVideoItem } from "./interface"

export function buildShortVideoAdapter(): QTWaterfallSection {
  let section: QTWaterfallSection = {
    _id: 'shortVideo1',
    type: 1009,
    style: {
      width: 540,
      height: 880,
    },
    listSID: 'shortVideo111',
    autofocusPosition: 0,
    decoration: {
      top: 200,
      left: 40,
    },
    itemList: []
  }
  return section
}

export function buildShortVideoItemAdapter(list: Array<ShortVideoItem>): Array<QTWaterfallItem> {
  let data: Array<QTWaterfallItem> = []
  list.forEach((item, index) => {
    const poster: any = {
      _id: item.id + '',
      type: 10090,
      decoration: {
        bottom: 30
      },
      style: {
        width: 540,
        height: 144,
      },
      ...item,
    }
    data.push(poster)
  })
  return data
}

class shortVideoManager{
  private bgPlayerRef: any
  setBgPlayerFef(ref : any) {
    this.bgPlayerRef = ref
  }
}

export let svManager = new shortVideoManager()
