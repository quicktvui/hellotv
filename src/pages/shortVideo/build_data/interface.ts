

export interface ShortVideoItem{
  id:string
  title:string
  poster:string
  corner:string
  [prop:string]:any
  actionRedirect?:{
    redirectType:number
    action: any,
    innerArgs:string
  }
}
