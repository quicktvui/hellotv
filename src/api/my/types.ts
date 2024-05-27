export interface Iconfig {
  bgColor?: string;//页面背景色 
  gradientBg?: object;//页面背景渐变色 
  // {colors:['#e5000000','#00000000'], cornerRadii4: [0, 0, 8, 8],orientation:4}
  // {colors: ['#FFEEB364', '#FFFFE398'], orientation: 3, cornerRadius: 12}
}
export interface IAnyobj {
  [k: string]: any
}