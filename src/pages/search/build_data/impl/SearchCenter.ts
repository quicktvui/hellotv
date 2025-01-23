import { QTListViewItem } from "@quicktvui/quicktvui3"

export interface SearchCenter{
  isHistoryList:boolean
  list:Array<QTListViewItem>
  [prop:string]:any
}
