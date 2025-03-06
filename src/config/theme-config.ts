import PrivateThemeConfig from "./private-theme-config"
export default {
  //渐进色设置
  //全局背景色
  bgGradientColor: PrivateThemeConfig.themeBgGradientColor,

  //按钮背景颜色
  btnGradientNormalColor: PrivateThemeConfig.themeBtnGradientNormalColor,
  btnGradientSelectColor: PrivateThemeConfig.themeBtnGradientSelectColor,
  btnGradientFocusColor: PrivateThemeConfig.themeBtnGradientFocusColor,

  //普通按钮文字，文字---颜色
  textNormalColorAndroid: PrivateThemeConfig.themeTextNormalColorAndroid,
  textNormalColor: PrivateThemeConfig.themeTextNormalColor,
  textSelectColor: PrivateThemeConfig.themeTextSelectColor,
  textFocusColor: PrivateThemeConfig.themeTextFocusColor,

  //瀑布流格子浮动标题背景色
  tabContentFloatBgColor: ['#ed222222', '#00000000'],
  //角标默认颜色
  tabCornerColors: ['#ffB67827', '#ffB67827'],

  //是否设置全局焦点边框圆角 默认 8
  focusBorderCornerEnable: true,
  //全局焦点边框圆角
  focusBorderCorner: PrivateThemeConfig.themeFocusBorderCorner,

  //是否设置全局焦点边框颜色 默认白色
  focusBorderColorEnable: false,
  //全局焦点边框颜色
  focusBorderColor: PrivateThemeConfig.themeFocusBorderColor,

  //是否设置全局焦点边框宽度 默认 2
  focusBorderWidthEnable: true,
  //全局焦点边框宽度
  focusBorderWidth: 3,

  //是否设置焦点边框向内移动距离 默认 2
  focusBorderInsetEnable: true,
  //全局焦点边框向内移动距离
  focusBorderInsetValue: -5,

  //是否展示焦点内边框 默认展示
  focusInnerBorderEnable: true,
  //设置放大倍数
  placeHolderFocusScale: 1.05,

}
