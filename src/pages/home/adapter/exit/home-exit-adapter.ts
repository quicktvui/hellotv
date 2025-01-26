import { QTListViewItem } from '@quicktvui/quicktvui3'
import { ExitListItem } from './home-exit-imp'

export function buildExitList(res: Array<ExitListItem>): Array<QTListViewItem> {
  const listData: QTListViewItem[] = []
  if (res && res.length > 0){
    res.forEach((item, index) => {
      listData.push({
        type: 1,
        title: item.title,
        image: {
          normal: item.cover
        },
        decoration: { left: 40, right: index === res.length - 1 ? 40 : 0 },
        jumpParams: item.jumpParams
      })
    })
  }
  return listData
}
