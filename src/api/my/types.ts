export interface Iconfig {
  bgColor?:string;//页面背景色
}
export interface IAnyobj {
  [k:string]:any
}
export interface ImyBlock {

}
export type Tbg = string|object
export const getBgColor = (bColor?:Tbg)=>{
  if(!bColor) return ''
  return (typeof bColor === 'string') ? {colors:[bColor,bColor],cornerRadius:0} : bColor
}