import { SearchResultItem } from "./SearchResultItem"


export interface SearchResult{
  id?:string
  plateName?:string,
  itemList:Array<SearchResultItem> | []
}
