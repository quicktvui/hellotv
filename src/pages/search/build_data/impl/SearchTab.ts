
export interface SearchTab{
  //用于焦点逻辑处理
  id:string
  //用于数据请求
  tabCode?:string
  //标题
  title:string
  //总数
  totalNum?:string
  [prop:string]:any
}
