import { QTWaterfallItem,QTWaterfallSection,QTWaterfallSectionType} from "@quicktvui/quicktvui3"
import { ShortVideoItem } from "./interface"

export function buildShortVideoAdapter(): QTWaterfallSection {
  let section: QTWaterfallSection = {
    _id: 'shortVideo1',
    type: 1009,
    style: {
      width: 1920,
      height: 1080,
    },
    tabListStyle: {
      width: 1920,
      height: 60,
      marginTop: 40,
      marginLeft: -24,
      marginBottom: 20,
    },
    listStyle: {
      width: 540,
      height: 880,
    },
    tabListSID: 'shortVideoTabListSID',
    listSID: 'shortVideoListSID',
    autofocusTabPosition: 0,
    autofocusListPosition: -1,
    decoration: {
      top: 60,
      left: 90,
    },
    tabList: [
      {type: 10091,title: '推荐', decoration: {}, name: 'tab_list_section_item'},
      {type: 10091,title: '日历', decoration: {}, name: 'tab_list_section_item'},
      {type: 10091,title: '历史', decoration: {}, name: 'tab_list_section_item'},
      {type: 10091,title: '收藏', decoration: {}, name: 'tab_list_section_item'},
    ],
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
      name: 'list_section_item',
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
