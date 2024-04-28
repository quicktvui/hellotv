export interface Tab {
  //tab id
  id?: string
  //tab 菜单code,用于获取对应tabContent数据
  menuCode: string
  //tab名称
  menuName: string
  //tab类型 0：文字，1：图片
  menuType: string
  //tab默认选中
  defaultHome?: string
  //tab默认图片
  image?: string
  //tab焦点图片
  focusImage?: string
  //tab 选中图片
  selectImage?: string
  //tab图片宽
  imageWidth?: number
  //tab图片高
  imageHeight?: number
  //角标图片
  cornerImage?: string
  //焦点角标图片
  focusCornerImage?: string
  //背景图
  backgroundImage?: string
  //文字标题图标
  textIcon?: string
}
