import { SearchResultItem } from "./SearchResultItem"


export interface SearchResult{
  id?:string
  plateName?:string,
  itemList:Array<SearchResultItem> | []
}

export interface GridSection{
  pageIndex: number
  tabItemId: string
  isRecommendRequest:boolean,
  tabListLength: number
  isShowCenterSearch: boolean
}
