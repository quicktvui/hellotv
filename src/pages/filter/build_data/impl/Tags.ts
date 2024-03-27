
export type Tags = {
  id?:string
  //默认角标
  iconNormal?:string
  //焦点角标
  iconFocus?:string
  //选中角标
  iconSelected?:string
  //是否展示筛选项
  isShowScreen?:boolean
  //名称类型：1：文字，2图片
  typeName?:string
  //接口使用值
  tagName:string
  //界面展示值
  showName:string
  //默认图片标题
  normalImg?:string
  //选中图片标题
  selectedImg?:string
  //焦点图片标题
  focusedImg?:string
  [prop:string]:any
}
