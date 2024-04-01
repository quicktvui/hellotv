

export interface SearchResultItem{
  id:string
  title:string
  poster:string
  corner:string
  [prop:string]:any
  actionRedirect?:{
    redirectType:number
    action:string,
    innerArgs:string
  }

}
