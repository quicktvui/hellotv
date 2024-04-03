type Tvalues<T> = T[ keyof T ]

export const topModes = {
  lr: 'left-right',
  rl: 'right-left'
} as const;

export interface IActivityConfig {
  bgColor?:string
  bgImg?:string
  top?: {
    mode?: Tvalues<typeof topModes>
    title?: string
    titleColor?:string
    titleSize?:number
    btnTxt?:string
    btnIcon?:string
    btnFocusedIcon?:string
    btnTxtColor?:string
    btnTxtBg?:string
    btnTxtFocusedBg?:string
    btnTxtFocusedColor?:string
  }
}
const config: IActivityConfig = {
  top: {
    mode: topModes.lr
  }
}

export interface IActivityBlockPosterLayout {
  width:number
  height:number
  paddingRect:number[]
}
export interface IActivityBlockText {
  txt: string
  fontSize:number
  color:string
  focusedColor:string
  bgColor:object|string
  focusedBg:object|string
  layout: IActivityBlockPosterLayout
}
export interface IActivityBlockItem {
  img:string
  title: IActivityBlockText
  tag: IActivityBlockText
}
export interface IActivityBlock {
  offsetT?:number
  titleTxt?:string
  titleImg?:string
  itemWidth?:number
  itemHeight?:number
  column?:number//列宽
  columnSpace?:number//列间距
  list: IActivityBlockItem[]
}