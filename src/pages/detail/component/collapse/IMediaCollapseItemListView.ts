import {QTListViewItem, QTICollapseItem} from "@quicktvui/quicktvui3";

export interface IMediaCollapseItemListView extends QTICollapseItem {
  setListData(dataList: Array<QTListViewItem>)

  setItemFocused(position: number): void

  setItemSelected(position: number): void
}
